import { v } from "convex/values";
import { action, mutation, query, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.CONVEX_OPENAI_BASE_URL,
  apiKey: process.env.CONVEX_OPENAI_API_KEY,
});

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

    const prompt = `Você é um especialista em análise de preços de corridas de transporte por aplicativo (como Uber, 99, etc.) no Brasil.

Analise a seguinte solicitação de corrida e classifique o preço esperado em relação à média histórica:

- Origem: ${args.origin}
- Destino: ${args.destination}
- Data: ${args.date} (${dayOfWeek})
- Horário: ${args.time} (${hour}h)

Considere fatores como:
- Horário de pico (manhã 7-9h, tarde 17-20h)
- Dia da semana (dias úteis vs fins de semana)
- Eventos especiais ou feriados próximos à data
- Condições climáticas típicas para a época do ano
- Distância e complexidade do trajeto
- Demanda histórica para esse tipo de rota

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem explicações fora do JSON):
{
  "classification": "Na média",
  "classificationLevel": 3,
  "reasoning": "Explicação concisa em português de 2-3 frases sobre por que o preço está nessa faixa",
  "factors": ["fator 1", "fator 2", "fator 3"]
}

Onde classificationLevel deve ser:
1 = "Muito abaixo do normal"
2 = "Abaixo do normal"
3 = "Na média"
4 = "Acima do normal"
5 = "Muito acima do normal"

E classification deve ser exatamente uma dessas strings:
"Muito abaixo do normal", "Abaixo do normal", "Na média", "Acima do normal", "Muito acima do normal"

factors deve ter entre 2 e 4 fatores principais que influenciam o preço.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const content = response.choices[0].message.content ?? "";

    let parsed: {
      classification: string;
      classificationLevel: number;
      reasoning: string;
      factors: string[];
    };

    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        classification: "Na média",
        classificationLevel: 3,
        reasoning: "Não foi possível analisar os dados com precisão. Estimativa baseada em padrões gerais.",
        factors: ["Dados insuficientes para análise detalhada"],
      };
    }

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

