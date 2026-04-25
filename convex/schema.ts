import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { predictionSchema } from "./schemas/prediction.schema";
import { locationSchema } from "./schemas/location.schema";
import { userRouteSchema } from "./schemas/userRoute.schema";
import { rideSchema } from "./schemas/ride.schema";

const applicationTables = {
  predictions: defineTable(predictionSchema).index("by_user", ["userId"]),
  locations: defineTable(locationSchema).index("by_place_id", ["place_id"]),
  userRoutes: defineTable(userRouteSchema).index("by_user", ["userId"]),
  rides: defineTable(rideSchema).index("by_route", ["from", "to"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
