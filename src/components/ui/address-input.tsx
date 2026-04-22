import { useRef, useEffect } from "react";
import { useAddressSearch } from "../../hooks/use-address-search";
import { LocationPicker } from "./location-picker";
import { Input } from "./input";
import { Location } from "../../../convex/schemas/location.schema";

type AddressInputProps = {
  label?: string;
  placeholder?: string;
  value: Location | null;
  onSelect: (value: Location | null) => void;
  error?: string;
};

export function AddressInput({ label, placeholder, value, onSelect, error }: AddressInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { query, setQuery, results, loading } = useAddressSearch();
  const showResults = query.length >= 3 && results.length > 0;

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
    onSelect(result);
    setQuery("");
  };

  const handleClear = () => {
    onSelect(null);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        label={label}
        type="text"
        placeholder={placeholder}
        error={error}
        value={query || value?.display_name || ""}
        onChange={(e) => {
          const found = results.find(r => r.display_name === e.target.value);
          if (found) {
            onSelect(found);
          } else {
            onSelect(null);
          }
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
