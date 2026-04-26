import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Location } from "./schemas/location.schema";

export const saveUserRoute = mutation({
  args: {
    originId: v.number(),
    destinationId: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "User must be authenticated to save a route",
      })
    }

    // Check if route already exists for this user
    const existingRoute = await ctx.db
      .query("userRoutes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("originId"), args.originId))
      .filter((q) => q.eq(q.field("destinationId"), args.destinationId))
      .first();

    if (existingRoute) {
      return existingRoute._id;
    }

    // Save new route
    return await ctx.db.insert("userRoutes", {
      userId,
      originId: args.originId,
      destinationId: args.destinationId,
    });
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
