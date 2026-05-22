import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/routes",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const routes = await ctx.runQuery(api.userRoutes.getUserRoutes, {});
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
    const { route, timestamp, rideType, price, waitTime, temperature, precipitation } = body;

    await ctx.runMutation(internal.rides.saveRide, {
      route,
      timestamp,
      rideType,
      price,
      waitTime,
      temperature,
      precipitation,
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

    let rides = [];
    if (routeId) {
      rides = await ctx.runQuery(api.rides.getRidesByRoute, {
        routeId: routeId as any,
      });
    } else {
      rides = await ctx.runQuery(api.rides.getAllRides, {});
    }

    return new Response(JSON.stringify(rides), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
})

export default http;
