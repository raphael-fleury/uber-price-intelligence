import { useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { PredictionData } from "@/schemas/prediction.schema";
import { features } from "../config/features";
import PricePredictorForm from "./price-predictor-form";
import { EmptyStateCard } from "./prediction-states/empty-state-card";
import { LoadingStateCard } from "./prediction-states/loading-state-card";
import { ResultSection } from "./prediction-states/result-section";

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
    } finally {
      setIsSaving(false);
    }
  };

  const renderRightColumn = () => {
    if (isLoading) return <LoadingStateCard />;
    if (prediction) {
      return (
        <ResultSection
          prediction={prediction}
          onLoginClick={onLoginClick}
          onSaveRoute={handleSaveRoute}
          isSaving={isSaving}
        />
      );
    }
    return <EmptyStateCard />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PricePredictorForm onPrediction={setPrediction} onLoadingChange={setIsLoading} />
      <div className="flex flex-col gap-6">{renderRightColumn()}</div>
    </div>
  );
}