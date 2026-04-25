import { MapPin, Trash2 } from "lucide-react";
import { Location } from "../../convex/schemas/location.schema";
import { Card } from "./ui/card";

type SavedRouteItemProps = {
  route: {
    _id: string;
    origin: Location | null;
    destination: Location | null;
  };
  onBackClick: () => void;
};

function LocationDisplay({ location, isOrigin }: { location: Location | null, isOrigin: boolean }) {
  const name = location?.name || "Local desconhecido";
  const details = location?.display_name.replace(name + ", ", "") || "Detalhes indisponíveis";
  
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-4 h-4 text-secondary" />
        <p className="text-sm text-on-surface-variant">{isOrigin ? "De" : "Para"}</p>
      </div>
      <p className="text-on-surface font-medium">
        {name}
      </p>
      <p className="text-ellipsis text-xs">
        {details}
      </p>
    </div>
  )
}

export default function SavedRouteItem({ route, onBackClick }: SavedRouteItemProps) {
  return (
    <Card
      key={route._id}
      variant="glass"
      padding="md"
      className="flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <LocationDisplay location={route.origin} />
        <button
          className="hover:bg-surface-high rounded-lg transition-colors text-on-surface-variant hover:text-semantic-crimson"
          title="Remover rota"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <LocationDisplay location={route.destination} />

      <div className="pt-2">
        <button
          onClick={onBackClick}
          className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
        >
          Ver Previsão
        </button>
      </div>
    </Card>
  );
}
