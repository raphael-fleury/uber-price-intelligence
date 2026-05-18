import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { rideType } from "./schemas/ride.schema";

export const saveRide = internalMutation({
  args: {
    routeId: v.id("userRoutes"),
    timestamp: v.number(),
    rideType: rideType,
    price: v.number(),
    waitTime: v.number(),
    temperature: v.number(),
    precipitation: v.number(),
  },
  handler: async (ctx, args) => {
    // Buscar a rota pelo ID
    const route = await ctx.db.get(args.routeId);
    if (!route) {
      throw new Error("Rota não encontrada");
    }

    // Buscar as locations pelos place_ids
    const fromLocation = await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", route.originId))
      .first();

    const toLocation = await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", route.destinationId))
      .first();

    if (!fromLocation || !toLocation) {
      throw new Error("Localizações não encontradas");
    }

    // Salvar o ride com os dados completos
    return await ctx.db.insert("rides", {
      timestamp: args.timestamp,
      from: fromLocation._id,
      to: toLocation._id,
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
    from: v.id("locations"),
    to: v.id("locations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rides")
      .withIndex("by_route", (q) => q.eq("from", args.from).eq("to", args.to))
      .collect();
  },
});

export const getRidesByRouteId = query({
  args: {
    routeId: v.id("userRoutes"),
  },
  handler: async (ctx, args) => {
    // Buscar a rota pelo ID
    const route = await ctx.db.get(args.routeId);
    if (!route) {
      throw new Error("Rota não encontrada");
    }

    // Buscar as locations pelos place_ids
    const fromLocation = await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", route.originId))
      .first();

    const toLocation = await ctx.db
      .query("locations")
      .withIndex("by_place_id", (q) => q.eq("place_id", route.destinationId))
      .first();

    if (!fromLocation || !toLocation) {
      return [];
    }

    // Buscar rides pela rota
    return await ctx.db
      .query("rides")
      .withIndex("by_route", (q) => q.eq("from", fromLocation._id).eq("to", toLocation._id))
      .collect();
  },
});
