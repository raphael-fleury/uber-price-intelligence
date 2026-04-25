import { v } from "convex/values";
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
      throw new Error("User must be authenticated to save a route");
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
