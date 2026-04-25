import { Infer } from "convex/values";
import { nominatimLocationSchema } from "./location.cache.schema";

export const locationSchema = nominatimLocationSchema.pick("place_id", "display_name", "name", "lat", "lon");

export type Location = Infer<typeof locationSchema>;