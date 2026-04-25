import { PredictionData } from "@/schemas/prediction.schema";
import { features } from "../../config/features";
import PredictionResult from "../prediction-result";
import { SaveRouteCard } from "./save-route-card";

type ResultSectionProps = {
  prediction: PredictionData;
  onLoginClick: () => void;
  onSaveRoute: () => void;
  isSaving: boolean;
};

export function ResultSection({ prediction, onLoginClick, onSaveRoute, isSaving }: ResultSectionProps) {
  return (
    <>
      <PredictionResult {...prediction} />
      {features.auth && (
        <SaveRouteCard onLoginClick={onLoginClick} onSaveRoute={onSaveRoute} isSaving={isSaving} />
      )}
    </>
  );
}
