import { ConvexError, v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Location } from "./schemas/location.schema";
import { internal } from "./_generated/api";
import { UserRoute } from "./schemas/userRoute.schema";

type OsrmRouteResponse = {
  code: string;
  routes?: Array<{
    distance: number;
    duration: number;
  }>;
};

export const getExistingUserRoute = internalQuery({
  args: {
    userId: v.id("users"),
    originId: v.number(),
    destinationId: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userRoutes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("originId"), args.originId))
      .filter((q) => q.eq(q.field("destinationId"), args.destinationId))
      .first();
  },
});

export const getLocationByPlaceId = internalQuery({
  args: {
    placeId: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", args.placeId))
      .first() as Location | null;
  },
});

export const insertUserRoute = internalMutation({
  args: {
    userId: v.id("users"),
    originId: v.number(),
    destinationId: v.number(),
    distance: v.number(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userRoutes", {
      userId: args.userId,
      originId: args.originId,
      destinationId: args.destinationId,
      distance: args.distance,
      duration: args.duration,
    });
  },
});

export const getRouteDistance = internalAction({
  args: {
    originId: v.number(),
    destinationId: v.number(),
  },
  handler: async (ctx, args) => {
    const origin = await ctx.runQuery(internal.userRoutes.getLocationByPlaceId, {
      placeId: args.originId,
    });
    const destination = await ctx.runQuery(internal.userRoutes.getLocationByPlaceId, {
      placeId: args.destinationId,
    });

    if (!origin || !destination) {
      throw new ConvexError({
        code: "LOCATION_NOT_FOUND",
        message: "Origin and destination must exist to save a route",
      });
    }

    const originLat = Number(origin.lat);
    const originLon = Number(origin.lon);
    const destinationLat = Number(destination.lat);
    const destinationLon = Number(destination.lon);

    if (
      Number.isNaN(originLat) ||
      Number.isNaN(originLon) ||
      Number.isNaN(destinationLat) ||
      Number.isNaN(destinationLon)
    ) {
      throw new ConvexError({
        code: "INVALID_LOCATION_COORDINATES",
        message: "Origin or destination has invalid coordinates",
      });
    }

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originLon},${originLat};${destinationLon},${destinationLat}?overview=false`;
    const osrmResponse = await fetch(osrmUrl);

    if (!osrmResponse.ok) {
      throw new ConvexError({
        code: "ROUTE_DISTANCE_FETCH_FAILED",
        message: "Unable to fetch route distance",
      });
    }

    const osrmData = await osrmResponse.json() as OsrmRouteResponse;
    const { distance, duration } = osrmData.routes?.[0] || {};
    
    if (osrmData.code !== "Ok" || typeof distance !== "number" || typeof duration !== "number") {
      throw new ConvexError({
        code: "ROUTE_NOT_FOUND",
        message: "Unable to calculate route distance",
      });
    }
    
    return { distance, duration }
  }
})

export const saveUserRoute = action({
  args: {
    originId: v.number(),
    destinationId: v.number(),
  },
  handler: async (ctx, args): Promise<void> => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated to save a route",
      })
    }

    // Check if route already exists for this user
    const existingRoute: UserRoute | null = await ctx.runQuery(
      internal.userRoutes.getExistingUserRoute,
      {
        userId,
        originId: args.originId,
        destinationId: args.destinationId,
      }
    );

    if (existingRoute) {
      return;
    }

    const origin = await ctx.runQuery(internal.userRoutes.getLocationByPlaceId, {
      placeId: args.originId,
    });
    const destination = await ctx.runQuery(internal.userRoutes.getLocationByPlaceId, {
      placeId: args.destinationId,
    });

    if (!origin || !destination) {
      throw new ConvexError({
        code: "LOCATION_NOT_FOUND",
        message: "Origin and destination must exist to save a route",
      });
    }

    const { distance, duration } = await ctx.runAction(internal.userRoutes.getRouteDistance, {
      originId: args.originId,
      destinationId: args.destinationId,
    });

    // Save new route
    await ctx.runMutation(internal.userRoutes.insertUserRoute, {
      userId,
      originId: args.originId,
      destinationId: args.destinationId,
      distance,
      duration,
    });
  },
});

export const getRoutes = query({
  args: {},
  handler: async (ctx) => {
    const routes = await ctx.db
      .query("userRoutes")
      .collect();

    const routesWithLocations = await Promise.all(
      routes.map(async (route) => {
        const origin = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", route.originId))
          .first() as Location | null;
        const destination = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", route.destinationId))
          .first() as Location | null;
        return {
          ...route,
          origin,
          destination,
        };
      })
    );

    return routesWithLocations;
  },
});

export const getUserRoutes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) return [];

    const userRoutes = await ctx.db
      .query("userRoutes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(50);

    const routesWithLocations = await Promise.all(
      userRoutes.map(async (route) => {
        const origin = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", route.originId))
          .first() as Location | null;
        const destination = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", route.destinationId))
          .first() as Location | null;
        return {
          ...route,
          origin,
          destination,
        };
      })
    );

    return routesWithLocations;
  },
});
