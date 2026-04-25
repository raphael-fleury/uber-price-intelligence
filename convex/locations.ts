import { v } from "convex/values";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { action, internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { locationSchema } from "./schemas/location.schema";
import { internal } from "./_generated/api";
import { NominatimLocation, nominatimLocationSchema } from "./schemas/location.cache.schema";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas em ms

export const searchLocationsInCache = internalQuery({
    args: {
        searchQuery: v.string(),
    },
    handler: async (ctx, args): Promise<NominatimLocation[] | null> => {
        const cached = await ctx.db
            .query("locationCache")
            .withIndex("by_search_query", (q) => q.eq("searchQuery", args.searchQuery))
            .first();

        if (!cached) {
            console.log(`No cache found for "${args.searchQuery}".`);
            return null;
        }

        const isCacheValid = differenceInMilliseconds(new Date(), new Date(cached.timestamp)) < CACHE_TTL;
        if (!isCacheValid) {
            console.log(`Cache entry for "${args.searchQuery}" is invalid.`);
            return null;
        }

        console.log(`Valid Cache entry found for "${args.searchQuery}". Returning cached results.`);
        return cached.results;
    }
});

export const searchLocationsInNominatim = internalAction({
    args: {
        searchQuery: v.string(),
    },
    handler: async (ctx, args): Promise<NominatimLocation[]> => {
        console.log(`Searching Nominatim for query: ${args.searchQuery}`);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${args.searchQuery}&format=json&limit=5`,
            {
                headers: {
                    'User-Agent': 'Uber Price Intelligence/1.0 (https://github.com/raphael-fleury/uber-price-intelligence)',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
                },
            }
        );

        const data = await response.json();
        return data;
    }
});

export const saveLocationsInCache = internalMutation({
    args: {
        searchQuery: v.string(),
        results: v.array(nominatimLocationSchema)
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("locationCache", {
            searchQuery: args.searchQuery,
            results: args.results,
            timestamp: Date.now()
        });
    }
});

export const searchLocations = action({
    args: {
        searchQuery: v.string(),
    },
    handler: async (ctx, args): Promise<NominatimLocation[]> => {
        // Check cache first
        const cached = await ctx.runQuery(internal.locations.searchLocationsInCache, { searchQuery: args.searchQuery });

        if (cached) {
            return cached;
        }

        // Fetch from Nominatim
        const data = await ctx.runAction(internal.locations.searchLocationsInNominatim, { searchQuery: args.searchQuery });

        // Cache the results
        await ctx.runMutation(internal.locations.saveLocationsInCache, { searchQuery: args.searchQuery, results: data });
        return data;
    }
})

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