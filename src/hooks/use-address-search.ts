import { useState, useEffect, useCallback } from "react";
import { useAction } from "convex/react";
import { Location } from "@/schemas/location.schema";
import { api } from "../../convex/_generated/api";

export function useAddressSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const searchLocations = useAction(api.locations.searchLocations);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const data = await searchLocations({ searchQuery });
        setResults(data);
      } catch (error) {
        console.error("Address search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchLocations]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, search]);

  return { query, setQuery, results, loading };
}
