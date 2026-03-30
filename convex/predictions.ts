import { v } from "convex/values";
import { action, mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const getPredictions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("predictions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const savePrediction = internalMutation({
  args: {
    userId: v.optional(v.id("users")),
    origin: v.string(),
    destination: v.string(),
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

export const predictPrice = action({
  args: {
    origin: v.string(),
    destination: v.string(),
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
      classification: randomClassification,
      classificationLevel: randomClassificationLevel,
      reasoning: `A corrida de ${args.origin} para ${args.destination} no ${dayOfWeek} às ${args.time} está classificada como "${randomClassification}" baseado em padrões históricos e condições atuais.
 Fatores principais influenciam essa estimativa.
`,
      factors: randomFactors,
    };

    await ctx.runMutation(internal.predictions.savePrediction, {
      userId: userId ?? undefined,
      origin: args.origin,
      destination: args.destination,
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

