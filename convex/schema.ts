import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  predictions: defineTable({
    userId: v.optional(v.id("users")),
    origin: v.string(),
    destination: v.string(),
    date: v.string(),
    time: v.string(),
    classification: v.string(),
    classificationLevel: v.number(),
    reasoning: v.string(),
    factors: v.array(v.string()),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
