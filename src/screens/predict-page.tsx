import { Authenticated, useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import PredictionLayout from "../components/prediction-layout";
import PredictionHistory from "../components/prediction-history";
import { features } from "../config/features";

export default function PredictPage() {
  const navigate = useNavigate();
  const loggedInUser = features.auth ? useQuery(api.auth.loggedInUser) : null;

  if (features.auth && loggedInUser === undefined) {
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
          Previsão de Preço de Corrida
        </h1>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto">
          Descubra se o preço da sua corrida estará acima ou abaixo do normal
        </p>
      </div>

      <PredictionLayout onLoginClick={() => navigate("/login")} />

      {features.auth && (
        <Authenticated>
          <PredictionHistory />
        </Authenticated>
      )}
    </>
  );
}
