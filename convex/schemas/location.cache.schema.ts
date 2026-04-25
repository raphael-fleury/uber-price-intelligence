import { Infer, v } from "convex/values";

export const nominatimLocationSchema = v.object({
  addresstype: v.string(),
  boundingbox: v.array(v.string()),
  class: v.string(),
  display_name: v.string(),
  importance: v.number(),
  lat: v.string(),
  licence: v.string(),
  lon: v.string(),
  name: v.string(),
  osm_id: v.number(),
  osm_type: v.string(),
  place_id: v.number(),
  place_rank: v.number(),
  type: v.string(),
});

export const locationCacheSchema = v.object({
  searchQuery: v.string(),
  results: v.array(nominatimLocationSchema),
  timestamp: v.number()
});

export type NominatimLocation = Infer<typeof nominatimLocationSchema>;
export type LocationCache = Infer<typeof locationCacheSchema>;