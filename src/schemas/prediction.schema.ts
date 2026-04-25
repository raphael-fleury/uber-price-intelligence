import z from "zod";
import { Location } from "../../convex/schemas/location.schema";

export const predictionSchema = z.object({
  originId: z.number().min(1, "Selecione a origem"),
  destinationId: z.number().min(1, "Selecione o destino"),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
});

export type PredictionFormData = z.infer<typeof predictionSchema>;

export type PredictionData = {
  origin: Location;
  destination: Location;
  date: string;
  time: string;
  variation: number;
  classification: string;
  classificationLevel: number;
  reasoning: string;
};