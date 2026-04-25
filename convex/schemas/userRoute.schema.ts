import { Infer, v } from "convex/values";

export const userRouteSchema = v.object({
  userId: v.optional(v.id("users")),
  originId: v.number(),
  destinationId: v.number(),
});

export type UserRoute = Infer<typeof userRouteSchema>;