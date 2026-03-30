import { useState } from "react";
import { BarChart3, Info } from "lucide-react";
import { Card } from "./ui";
import PredictionResult from "./prediction-result";
import PricePredictorForm from "./price-predictor-form";

type PredictionData = {
  classification: string;
  classificationLevel: number;
  reasoning: string;
  factors: string[];
};

export default function PredictionLayout({ onLoginClick }: { onLoginClick: () => void }) {
  const [prediction, setPrediction] = useState<{
    data: PredictionData;
    origin: string;
    destination: string;
    date: string;
    time: string;
  } | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PricePredictorForm onPrediction={setPrediction} />
      <div className="flex flex-col gap-6">
        {prediction ? (
          <>
            <PredictionResult
              result={prediction.data}
              origin={prediction.origin}
              destination={prediction.destination}
              date={prediction.date}
              time={prediction.time}
            />
            <Card variant="glass" padding="md" className="flex flex-row items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-on-surface text-sm">Quer mais precisão?</p>
                <p className="text-xs text-on-surface-variant mt-1">
                  <button onClick={onLoginClick} className="text-secondary font-medium hover:underline">Crie uma conta</button> para monitorar suas rotas favoritas e receber alertas de volatilidade em tempo real.
                </p>
              </div>
            </Card>
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