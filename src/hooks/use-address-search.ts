import { useState, useEffect, useCallback } from "react";

export interface AddressResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
  importance: number;
}

export function useAddressSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=5`
      );

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Address search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      search(query);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, search]);

  return { query, setQuery, results, loading };
}
