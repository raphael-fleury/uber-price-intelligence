import { Infer, v } from "convex/values";

export const rideType = v.union(
  v.literal("uber_x"),
  v.literal("uber_moto"),
  v.literal("comfort"),
  v.literal("bag")
);

export const rideSchema = v.object({
  timestamp: v.number(),
  from: v.id("locations"),
  to: v.id("locations"),
  rideType: rideType,
  price: v.number(),
  waitTime: v.number(),
  temperature: v.number(),
  precipitation: v.number(),
});

export type Ride = Infer<typeof rideSchema>;
export type RideType = Infer<typeof rideType>;