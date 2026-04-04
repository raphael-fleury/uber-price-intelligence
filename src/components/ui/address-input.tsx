import { useRef, useEffect } from "react";
import { useAddressSearch, AddressResult } from "../../hooks/use-address-search";
import { LocationPicker } from "./location-picker";
import { Input, InputProps } from "./input";

type AddressInputProps = InputProps & {
  value: string;
  onChange: (value: string) => void;
};

export function AddressInput({ value, onChange, ...params }: AddressInputProps) {
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

  const handleSelect = (result: AddressResult) => {
    onChange(result.display_name);
    setQuery("");
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        type="text"
        value={query || value}
        onChange={(e) => {
          onChange(e.target.value);
          setQuery(e.target.value);
        }}
        {...params}
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
