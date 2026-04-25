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

export default function SavedRouteItem({ route, onBackClick }: SavedRouteItemProps) {
  return (
    <Card
      key={route._id}
      variant="glass"
      padding="md"
      className="flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-secondary" />
            <p className="text-sm text-on-surface-variant">De</p>
          </div>
          <p className="text-on-surface font-medium">
            {route.origin?.display_name || "Origem desconhecida"}
          </p>
        </div>
        <button
          className="p-2 hover:bg-surface-high rounded-lg transition-colors text-on-surface-variant hover:text-semantic-crimson"
          title="Remover rota"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="h-px bg-surface-variant opacity-50"></div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-secondary" />
          <p className="text-sm text-on-surface-variant">Para</p>
        </div>
        <p className="text-on-surface font-medium">
          {route.destination?.display_name || "Destino desconhecido"}
        </p>
      </div>

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
