import z from "zod";
import { locationSchema } from "./location.schema";

export const predictionSchema = z.object({
  origin: locationSchema.refine((val) => val !== null && val !== undefined, {
    message: "Informe a origem",
  }),
  destination: locationSchema.refine((val) => val !== null && val !== undefined, {
    message: "Informe o destino",
  }),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
});

export type PredictionFormData = z.infer<typeof predictionSchema>;

export type PredictionData = PredictionFormData & {
  classification: string;
  classificationLevel: number;
  reasoning: string;
  factors: string[];
};