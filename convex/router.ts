import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/routes",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const routes = await ctx.runQuery(api.userRoutes.getRoutes, {});
    return new Response(JSON.stringify(routes), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
});

http.route({
  path: "/rides",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { route, timestamp, rideType, price, waitTime, temperature, precipitation, weatherCode } = body;

    await ctx.runMutation(internal.rides.saveRide, {
      route,
      timestamp,
      rideType,
      price,
      waitTime,
      temperature,
      precipitation,
      weatherCode,
    });
    return new Response("", {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  })
});

http.route({
  path: "/rides",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const routeId = url.searchParams.get("routeId");
    const routeType = url.searchParams.get("routeType") ?? url.searchParams.get("rideType");

    const rides = await ctx.runQuery(api.rides.getAllRides, {
      routeId: (routeId || undefined) as any,
      routeType: (routeType || undefined) as any,
    });

    return new Response(JSON.stringify(rides), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
});

http.route({
  path: "/rides/average-price-by-weekday",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const routeId = url.searchParams.get("routeId");
    const rideType = url.searchParams.get("rideType");

    const weekdayAverages = await ctx.runQuery(api.rides.getAveragePriceByWeekday, {
      routeId: (routeId || undefined) as any,
      rideType: (rideType || undefined) as any,
    });

    return new Response(JSON.stringify(weekdayAverages), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
});

http.route({
  path: "/rides/average-price-by-hour",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const routeId = url.searchParams.get("routeId");
    const rideType = url.searchParams.get("rideType");

    const hourAverages = await ctx.runQuery(api.rides.getAveragePriceByHourBand, {
      routeId: (routeId || undefined) as any,
      rideType: (rideType || undefined) as any,
    });

    return new Response(JSON.stringify(hourAverages), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
});

http.route({
  path: "/rides/average-price",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const routeId = url.searchParams.get("routeId");
    const rideType = url.searchParams.get("rideType");

    const averagePrice = await ctx.runQuery(api.rides.getAveragePrice, {
      routeId: (routeId || undefined) as any,
      rideType: (rideType || undefined) as any,
    });

    return new Response(JSON.stringify(averagePrice), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
});

export default http;
