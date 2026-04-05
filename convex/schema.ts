import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { predictionSchema } from "./schemas/prediction.schema";
import { locationSchema } from "./schemas/location.schema";

const applicationTables = {
  predictions: defineTable(predictionSchema).index("by_user", ["userId"]),
  locations: defineTable(locationSchema).index("by_place_id", ["place_id"])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
