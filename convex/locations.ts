import { v } from "convex/values";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { internalAction, internalMutation } from "./_generated/server";
import { locationSchema } from "./schemas/location.schema";

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

export const getLocationClimateAtTime = internalAction({
    args: {
        latitude: v.string(),
        longitude: v.string(),
        date: v.string(),
        time: v.string(),
    },
    handler: async (ctx, args) => {
        const params = new URLSearchParams({
            latitude: args.latitude,
            longitude: args.longitude,
            start_date: args.date,
            end_date: args.date,
            hourly: "temperature_2m,precipitation,weather_code",
        });
        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();

        const targetDate = parseISO(`${args.date}T${args.time}`);
        const parsedDates = data.hourly.time.map(parseISO) as Date[];

        const closestDateIndex = parsedDates.reduce((closestIdx, current, index, arr) => {
            const currentDiff = Math.abs(differenceInMilliseconds(current, targetDate));
            const closestDiff = Math.abs(differenceInMilliseconds(arr[closestIdx], targetDate));

            return currentDiff < closestDiff ? index : closestIdx;
        }, 0);

        return {
            temperature: data.hourly.temperature_2m[closestDateIndex],
            precipitation: data.hourly.precipitation[closestDateIndex],
        }
    }
})