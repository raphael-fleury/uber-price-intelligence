import { useQuery } from "convex/react";
import { Clock } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import PredictionHistoryItem from "./prediction-history-item";

export default function PredictionHistory() {
  const predictions = useQuery(api.predictions.getPredictions);

  if (!predictions || predictions.length === 0) return null;

  return (
    <Card variant="section" padding="md">
      <h2 className="text-lg font-semibold text-on-surface mb-5 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
        </span>
        Consultas Recentes
      </h2>
      <div className="flex flex-col gap-3">
        {predictions.map((p) => (
          <PredictionHistoryItem
            key={p._id}
            origin={p.origin}
            destination={p.destination}
            date={p.date}
            time={p.time}
            classification={p.classification}
            classificationLevel={p.classificationLevel}
          />
        ))}
      </div>
    </Card>
  );
}
