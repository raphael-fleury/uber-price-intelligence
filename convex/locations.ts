import { internalMutation } from "./_generated/server";
import { locationSchema } from "./schemas/location.schema";

export const getOrCreateLocation = internalMutation({
  args: locationSchema,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", args.place_id))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("locations", args);
  },
});