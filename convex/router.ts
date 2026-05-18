import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/rides",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const { routeId, timestamp, rideType, price, waitTime, temperature, precipitation } = body;

    await ctx.runMutation(internal.rides.saveRide, {
      routeId,
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

    if (!routeId) {
      return new Response(JSON.stringify({ error: "routeId é obrigatório" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const rides = await ctx.runQuery(api.rides.getRidesByRouteId, {
      routeId: routeId as any,
    });

    return new Response(JSON.stringify(rides), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  })
})

export default http;
