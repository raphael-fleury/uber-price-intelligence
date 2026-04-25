import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "../components/ui/card";
import { MapPin, Trash2 } from "lucide-react";
import SavedRouteItem from "@/components/saved-route-item";

type SavedRoutesPageProps = {
  onBackClick: () => void;
};

export default function SavedRoutesPage({ onBackClick }: SavedRoutesPageProps) {
  const routes = useQuery(api.userRoutes.getUserRoutes);

  if (routes === undefined) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-surface-variant border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-on-surface mb-3 tracking-tight">
          Rotas Salvas
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto">
          Suas rotas monitoradas para alertas de volatilidade
        </p>
      </div>

      {routes.length === 0 ? (
        <Card variant="glass" padding="lg" className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-on-surface-variant text-lg mb-6">
            Você ainda não tem rotas salvas
          </p>
          <button
            onClick={onBackClick}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Voltar para Previsões
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {routes.map((route) => (
            <SavedRouteItem key={route._id} route={route} onBackClick={onBackClick} />
          ))}
        </div>
      )}
    </>
  );
}
