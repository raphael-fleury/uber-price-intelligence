import { Infer, v } from "convex/values";

export const predictionSchema = v.object({
  userId: v.optional(v.id("users")),
  origin: v.string(),
  destination: v.string(),
  date: v.string(),
  time: v.string(),
  classification: v.string(),
  classificationLevel: v.number(),
  reasoning: v.string(),
  factors: v.array(v.string()),
});

export type Prediction = Infer<typeof predictionSchema>;