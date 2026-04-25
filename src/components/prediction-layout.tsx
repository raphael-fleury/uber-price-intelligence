import { useState } from "react";
import { BarChart3, Info, Activity } from "lucide-react";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { PredictionData } from "@/schemas/prediction.schema";
import { features } from "../config/features";
import { Card } from "./ui/card";
import { Spinner, Loading } from "./ui/spinner";
import PredictionResult from "./prediction-result";
import PricePredictorForm from "./price-predictor-form";

type PredictionLayoutProps = {
  onLoginClick: () => void;
};

export default function PredictionLayout({ onLoginClick }: PredictionLayoutProps) {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const saveUserRoute = useMutation(api.userRoutes.saveUserRoute);

  const handleSaveRoute = async () => {
    if (!prediction) return;

    setIsSaving(true);
    try {
      await saveUserRoute({
        originId: prediction.origin.place_id,
        destinationId: prediction.destination.place_id,
      });
      setTimeout(() => {
        navigate("/saved-routes");
      }, 500);
    } catch (error) {
      console.error("Error saving route:", error);
      // Optionally show an error message here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PricePredictorForm onPrediction={setPrediction} onLoadingChange={setIsLoading} />
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <Card variant="glass" padding="lg" className="flex flex-1 items-center justify-center min-h-[300px]">
            <Loading
              message="Analisando dados históricos..."
              submessage="Verificando padrões de preço, horário e condições"
            >
              <Activity className="w-7 h-7 text-primary" />
            </Loading>
          </Card>
        ) : prediction ? (
          <>
            <PredictionResult
              {...prediction}
            />
            {features.auth && (
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
                        onClick={handleSaveRoute}
                        disabled={isSaving}
                        className="text-secondary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                      >
                        Salve essa rota
                      </button> para receber alertas de volatilidade em tempo real e acompanhar o histórico de preços.
                    </p>
                  </Authenticated>
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card variant="glass" padding="lg" className="hidden lg:flex flex-1 min-h-[300px] items-center justify-center">
            <div className="text-center text-on-surface-variant">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm">Preencha o formulário ao lado para ver a previsão</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}