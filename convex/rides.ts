import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { rideSchema, rideType } from "./schemas/ride.schema";

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
      weatherCode: args.weatherCode,
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

export const getAllRides = query({
  args: {},
  handler: async (ctx) => {
    const rides = await ctx.db.query("rides").collect();
    
    // Enriquecer cada corrida com informações da rota e localizações
    const ridesWithRoute = await Promise.all(
      rides.map(async (ride) => {
        const route = await ctx.db.get(ride.route);
        
        // Buscar informações de origem e destino
        const origin = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", route!.originId))
          .first();
        
        const destination = await ctx.db
          .query("locations")
          .withIndex("by_place_id", (q) => q.eq("place_id", route!.destinationId))
          .first();
        
        return {
          ...ride,
          origin,
          destination,
        };
      })
    );
    
    return ridesWithRoute;
  },
});

export const getAveragePriceByWeekday = query({
  args: {
    routeId: v.id("userRoutes"),
    rideTypeFilter: v.optional(rideType),
  },
  handler: async (ctx, args) => {
    // Validar se a rota existe
    const route = await ctx.db.get(args.routeId);
    if (!route) {
      throw new Error("Rota não encontrada");
    }

    // Buscar rides pela rota
    let rides = await ctx.db
      .query("rides")
      .withIndex("by_route", (q) => q.eq("route", args.routeId))
      .collect();

    // Filtrar por tipo de corrida se fornecido
    if (args.rideTypeFilter) {
      rides = rides.filter((ride) => ride.rideType === args.rideTypeFilter);
    }

    // Dias da semana em português
    const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    // Inicializar acumuladores para cada dia
    const priceByWeekday: Record<number, { sum: number; count: number }> = {};
    for (let i = 0; i < 7; i++) {
      priceByWeekday[i] = { sum: 0, count: 0 };
    }

    // Agrupar rides por dia da semana e somar preços
    rides.forEach((ride) => {
      const date = new Date(ride.timestamp);
      const dayOfWeek = date.getDay();
      priceByWeekday[dayOfWeek].sum += ride.price;
      priceByWeekday[dayOfWeek].count += 1;
    });

    // Calcular médias
    const result = weekdays.map((weekday, index) => ({
      weekday,
      dayIndex: index,
      averagePrice: priceByWeekday[index].count > 0 
        ? Math.round((priceByWeekday[index].sum / priceByWeekday[index].count) * 100) / 100
        : 0,
      rideCount: priceByWeekday[index].count,
    }));

    return result;
  },
});

export const getAveragePriceByHourBand = query({
  args: {
    routeId: v.id("userRoutes"),
    rideTypeFilter: v.optional(rideType),
  },
  handler: async (ctx, args) => {
    // Validar se a rota existe
    const route = await ctx.db.get(args.routeId);
    if (!route) {
      throw new Error("Rota não encontrada");
    }

    // Buscar rides pela rota
    let rides = await ctx.db
      .query("rides")
      .withIndex("by_route", (q) => q.eq("route", args.routeId))
      .collect();

    // Filtrar por tipo de corrida se fornecido
    if (args.rideTypeFilter) {
      rides = rides.filter((ride) => ride.rideType === args.rideTypeFilter);
    }

    // Inicializar acumuladores para cada hora (0-23)
    const priceByHour: Record<number, { sum: number; count: number }> = {};
    for (let i = 0; i < 24; i++) {
      priceByHour[i] = { sum: 0, count: 0 };
    }

    // Agrupar rides por hora e somar preços
    rides.forEach((ride) => {
      const date = new Date(ride.timestamp);
      const hour = date.getHours();
      priceByHour[hour].sum += ride.price;
      priceByHour[hour].count += 1;
    });

    // Calcular médias
    const result = Array.from({ length: 24 }, (_, index) => ({
      hourStart: index,
      hourEnd: (index + 1) % 24,
      timeRange: `${String(index).padStart(2, "0")}h-${String((index + 1) % 24).padStart(2, "0")}h`,
      averagePrice: priceByHour[index].count > 0 
        ? Math.round((priceByHour[index].sum / priceByHour[index].count) * 100) / 100
        : 0,
      rideCount: priceByHour[index].count,
    }));

    return result;
  },
});
