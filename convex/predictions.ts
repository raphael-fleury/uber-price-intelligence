import { v } from "convex/values";
import { action, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Location, locationSchema } from "./schemas/location.schema";

export const getPredictions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const predictions = await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    const predictionsWithLocations = await Promise.all(
      predictions.map(async (prediction) => {
        const origin = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", prediction.originId))
          .first() as Location;
        const destination = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", prediction.destinationId))
          .first() as Location;
        return {
          ...prediction,
          origin,
          destination,
        };
      })
    );

    return predictionsWithLocations;
  },
});

export const savePrediction = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    originId: v.number(),
    destinationId: v.number(),
    date: v.string(),
    time: v.string(),
    classification: v.string(),
    classificationLevel: v.number(),
    reasoning: v.string(),
    factors: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("predictions", args);
  },
});

export const getOrCreateLocation = internalMutation({
  args: locationSchema,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", args.place_id))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("locations", args);
  },
});

export const predictPrice = action({
  args: {
    origin: locationSchema,
    destination: locationSchema,
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const dateObj = new Date(`${args.date}T${args.time}`);
    const dayOfWeek = dateObj.toLocaleDateString("pt-BR", { weekday: "long" });
    const hour = dateObj.getHours();

    // Gerar valores aleatórios para simulação
    const classificationLevels = [1, 2, 3, 4, 5];
    const classifications = [
      "Muito abaixo do normal",
      "Abaixo do normal",
      "Na média",
      "Acima do normal",
      "Muito acima do normal",
    ];
    const factorsOptions = [
      "Horário de pico",
      "Dia da semana",
      "Demanda alta",
      "Distância longa",
      "Trânsito intenso",
      "Clima adverso",
      "Horário noturno",
      "Final de semana",
    ];

    const randomClassificationLevel =
      classificationLevels[Math.floor(Math.random() * classificationLevels.length)];
    const randomClassification = classifications[randomClassificationLevel - 1];
    const randomFactors = [] as Array<typeof factorsOptions[number]>;
    for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
      const randomFactor =
        factorsOptions[Math.floor(Math.random() * factorsOptions.length)];
      if (!randomFactors.includes(randomFactor)) {
        randomFactors.push(randomFactor);
      }
    }

    const parsed = {
      ...args,
      classification: randomClassification,
      classificationLevel: randomClassificationLevel,
      reasoning: `A corrida de ${args.origin.name} para ${args.destination.name} no ${dayOfWeek} às ${args.time} está classificada como "${randomClassification}" baseado em padrões históricos e condições atuais.
 Fatores principais influenciam essa estimativa.
`,
      factors: randomFactors,
    };

    await ctx.runMutation(internal.predictions.getOrCreateLocation, args.origin);
    await ctx.runMutation(internal.predictions.getOrCreateLocation, args.destination);

    await ctx.runMutation(internal.predictions.savePrediction, {
      userId: userId ?? undefined,
      originId: args.origin.place_id,
      destinationId: args.destination.place_id,
      date: args.date,
      time: args.time,
      classification: parsed.classification,
      classificationLevel: parsed.classificationLevel,
      reasoning: parsed.reasoning,
      factors: parsed.factors,
    });

    return parsed;
  },
});

