import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { predictionSchema } from "./schemas/prediction.schema";

const applicationTables = {
  predictions: defineTable(predictionSchema).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
