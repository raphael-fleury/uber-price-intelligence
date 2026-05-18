import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { rideSchema } from "./schemas/ride.schema";

export const saveRide = internalMutation({
  args: rideSchema,
  handler: async (ctx, args) => {
    // Validar se a rota existe
    const route = await ctx.db.get(args.route);
    if (!route) {
      throw new Error("Rota não encontrada");
    }

    // Salvar o ride
    return await ctx.db.insert("rides", {
      timestamp: args.timestamp,
      route: args.route,
      rideType: args.rideType,
      price: args.price,
      waitTime: args.waitTime,
      temperature: args.temperature,
      precipitation: args.precipitation,
    });
  },
});

export const getRidesByRoute = query({
  args: {
    routeId: v.id("userRoutes"),
  },
  handler: async (ctx, args) => {
    // Validar se a rota existe
    const route = await ctx.db.get(args.routeId);
    if (!route) {
      throw new Error("Rota não encontrada");
    }

    // Buscar rides pela rota
    return await ctx.db
      .query("rides")
      .withIndex("by_route", (q) => q.eq("route", args.routeId))
      .collect();
  },
});
