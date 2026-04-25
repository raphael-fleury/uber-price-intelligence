import { Info } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";

type SaveRouteCardProps = {
  onLoginClick: () => void;
  onSaveRoute: () => void;
  isSaving: boolean;
};

export function SaveRouteCard({ onLoginClick, onSaveRoute, isSaving }: SaveRouteCardProps) {
  return (
    <Card variant="glass" padding="md" className="flex flex-row items-start gap-3">
      {isSaving ? (
        <Spinner className="w-3 h-3" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-white" />
        </div>
      )}
      <div>
        <p className="font-semibold text-on-surface text-sm">Quer mais precisão?</p>
        <Unauthenticated>
          <p className="text-xs text-on-surface-variant mt-1">
            <button onClick={onLoginClick} className="text-secondary font-medium hover:underline">
              Crie uma conta
            </button> para monitorar suas rotas favoritas e receber alertas de volatilidade em tempo real.
          </p>
        </Unauthenticated>
        <Authenticated>
          <p className="text-xs text-on-surface-variant mt-1">
            <button
              onClick={onSaveRoute}
              disabled={isSaving}
              className="text-secondary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              Salve essa rota
            </button> para receber alertas de volatilidade em tempo real e acompanhar o histórico de preços.
          </p>
        </Authenticated>
      </div>
    </Card>
  );
}
