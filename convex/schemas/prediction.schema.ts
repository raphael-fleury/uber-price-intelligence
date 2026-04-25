import { Infer, v } from "convex/values";

export const predictionSchema = v.object({
  userId: v.optional(v.id("users")),
  originId: v.number(),
  destinationId: v.number(),
  date: v.string(),
  time: v.string(),
  variation: v.number()
});

export type Prediction = Infer<typeof predictionSchema>;