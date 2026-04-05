import { useRef, useEffect } from "react";
import { useAddressSearch } from "../../hooks/use-address-search";
import { LocationPicker } from "./location-picker";
import { Input, InputProps } from "./input";
import { Location } from "@/schemas/location.schema";

type AddressInputProps = Omit<InputProps, "value"> & {
  value: Location | null;
  setValue: (value: Location | null) => void;
};

export function AddressInput({ value, setValue, ...params }: AddressInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, loading } = useAddressSearch();
  const showResults = query.length >= 3 && results.length > 0;

  console.log({ query, value })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setQuery]);

  const handleSelect = (result: Location) => {
    setValue(result);
    setQuery("");
  };

  const handleClear = () => {
    setValue(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        {...params}
        type="text"
        value={query || value?.display_name || ""}
        onChange={(e) => {
          setValue(results.find(r => r.display_name === e.target.value) || null);
          setQuery(e.target.value);
        }}
        handleClear={value ? handleClear : undefined}
      />

      <LocationPicker
        query={query}
        results={showResults ? results : []}
        loading={loading}
        handleSelect={handleSelect}
      />
    </div>
  );
}
