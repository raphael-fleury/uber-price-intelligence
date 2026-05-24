import { ConvexError, v } from "convex/values";
import { action, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api, internal } from "./_generated/api";
import { Location, locationSchema } from "./schemas/location.schema";
import { addDays, isBefore } from "date-fns";

const modelApiUrl = process.env.MODEL_API_URL || "http://localhost:8000";

const classifications = [
  "Muito abaixo do normal",
  "Abaixo do normal",
  "Na média",
  "Acima do normal",
  "Muito acima do normal",
];

function classifyVariation(variation: number) {
  if (variation <= -0.5) return 1;
  if (variation <= -0.1) return 2;
  if (variation <= 0.1) return 3;
  if (variation <= 0.5) return 4;
  return 5;
}

function formatReasoning(prediction: any) {
  const dateObj = new Date(`${prediction.date}T${prediction.time}`);
  return `A corrida de ${prediction.origin.name} para ${prediction.destination.name} no dia ${dateObj.toLocaleDateString("pt-BR")} às ${prediction.time} está classificada como "${prediction.classification}" baseado em padrões históricos e condições atuais.`;
}

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


        const classificationLevel = classifyVariation(prediction.variation);
        const classification = classifications[classificationLevel - 1];

        const reasoning = formatReasoning({ ...prediction, origin, destination, classification });

        return {
          ...prediction,
          origin,
          destination,
          classification,
          classificationLevel,
          reasoning,
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
    variation: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("predictions", args);
  },
});

export const predictPrice = action({
  args: {
    origin: locationSchema,
    destination: locationSchema,
    date: v.string(),
    time: v.string(),
    routeId: v.optional(v.id("userRoutes")),
  },
  handler: async (ctx, args) => {
    if (args.origin.place_id === args.destination.place_id) {
      throw new ConvexError({
        code: "INVALID_LOCATION",
        message: "Origem e destino não podem ser iguais.",
      });
    }

    const userId = await getAuthUserId(ctx);

    const dateObj = new Date(`${args.date}T${args.time}`);

    const today = new Date();
    const maxClimateDate = addDays(today, 14);

    let originClimate = null;
    let destinationClimate = null;
    if (isBefore(dateObj, maxClimateDate)) {
      originClimate = await ctx.runAction(internal.locations.getLocationClimateAtTime, {
        latitude: args.origin.lat,
        longitude: args.origin.lon,
        date: args.date,
        time: args.time,
      });

      destinationClimate = await ctx.runAction(internal.locations.getLocationClimateAtTime, {
        latitude: args.destination.lat,
        longitude: args.destination.lon,
        date: args.date,
        time: args.time,
      });
    }

    const requestBody = {
      origin: {
        latitude: Number(args.origin.lat),
        longitude: Number(args.origin.lon),
      },
      destination: {
        latitude: Number(args.destination.lat),
        longitude: Number(args.destination.lon),
      },
      rideType: "uber_x",
      datetime: `${args.date} ${args.time}:00`,
      temperature: originClimate ? originClimate.temperature : undefined,
      precipitation: originClimate ? originClimate.precipitation : undefined,
      weatherCode: originClimate ? originClimate.weatherCode : undefined
    };

    const response = await fetch(`${modelApiUrl}/predict`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      console.error("Erro ao obter previsão do modelo:", response.status, await response.text());
      throw new ConvexError({
        code: "MODEL_ERROR",
        message: "Erro ao obter previsão. Tente novamente.",
      });
    }

    const price: number = (await response.json()).predicted_price;
    const { averagePrice } = await ctx.runQuery(api.rides.getAveragePrice, {
      routeId: args.routeId,
      rideType: "uber_x"
    }) as { averagePrice: number };

    const variation = (price - averagePrice) / averagePrice;
    const classificationLevel = classifyVariation(variation);
    const classification = classifications[classificationLevel - 1];

    const parsed = {
      ...args,
      classificationLevel,
      classification,
      variation,
      reasoning: formatReasoning({ ...args, classification }),
    };

    await ctx.runMutation(internal.locations.getOrCreateLocation, args.origin);
    await ctx.runMutation(internal.locations.getOrCreateLocation, args.destination);

    await ctx.runMutation(internal.predictions.savePrediction, {
      userId: userId ?? undefined,
      originId: args.origin.place_id,
      destinationId: args.destination.place_id,
      date: args.date,
      time: args.time,
      variation
    });

    return parsed;
  },
});

