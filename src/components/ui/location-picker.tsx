import { MapPin } from "lucide-react";
import { AddressResult } from "@/hooks/use-address-search";
import { useMemo } from "react";

type LocationPickerProps = {
  query: string;
  results: AddressResult[];
  loading: boolean;
  handleSelect: (result: AddressResult) => void;
}

export const LocationPicker = ({ query, results, loading, handleSelect }: LocationPickerProps) => {
  const content = useMemo(() => {
    if (loading)
      return <Loading />;
    if (results.length <= 0)
      return <NoResults />;

    return (
      results.map((result) => (
        <li key={result.place_id}>
          <button
            type="button"
            onClick={() => handleSelect(result)}
            className="w-full px-4 py-3 text-left text-sm hover:bg-surface-variant flex items-start gap-2"
          >
            <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-on-surface">{result.name}</span>
              <span className="text-outline">{result.display_name.replace(result.name + ", ", "")}</span>
            </div>
          </button>
        </li>
      ))
    )
  }, [loading, results, handleSelect]);

  if (query.length < 3)
    return null;

  return (
    <ul className="absolute z-20 w-full bg-surface-lowest border border-outline/20 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
      {content}
    </ul>
  )
}

const Loading = () => (
  <div className="flex items-center p-3 gap-2 text-on-surface-variant text-sm">
    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    Buscando...
  </div>
);

const NoResults = () => (
  <div className="w-full px-4 py-3 text-left text-sm hover:bg-surface-variant flex items-start gap-2">
    <span className="text-on-surface">Nenhum resultado encontrado</span>
  </div>
);