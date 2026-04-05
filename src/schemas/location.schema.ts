import z from "zod";

export const locationSchema = z.object({
  place_id: z.number(),
  name: z.string(),
  display_name: z.string(),
  lat: z.string(),
  lon: z.string(),
})

export type Location = z.infer<typeof locationSchema>;