import { Circle, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import { Chip } from "./ui/chip";
import { PredictionData } from "@/schemas/prediction.schema";

type ChipColor = "emerald" | "lime" | "blue" | "orange" | "crimson";

const levelColors: Record<number, ChipColor> = {
  1: "emerald",
  2: "lime",
  3: "blue",
  4: "orange",
  5: "crimson",
};

const levelDotColors: Record<number, string> = {
  1: "bg-semantic-emerald",
  2: "bg-semantic-lime",
  3: "bg-semantic-blue",
  4: "bg-semantic-orange",
  5: "bg-semantic-crimson",
};

type PredictionHistoryItemProps = {
  prediction: PredictionData
};

export default function PredictionHistoryItem({ prediction }: PredictionHistoryItemProps) {
  const {
    origin,
    destination,
    date,
    time,
    classification,
    classificationLevel,
  } = prediction;

  const level = Math.max(1, Math.min(5, classificationLevel));
  const formattedDate = new Date(`${date}T${time}`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Card variant="elevated" padding="sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm text-on-surface font-medium truncate">
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <span className="truncate">{origin.name}</span>
            <Circle className="w-3 h-3 text-on-surface-variant shrink-0" />
            <span className="truncate">{destination.name}</span>
          </div>
          <p className="text-on-surface-variant text-xs mt-1">{formattedDate} às {time}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`w-2 h-2 rounded-full ${levelDotColors[level]}`}></span>
          <Chip variant="soft" color={levelColors[level]}>
            {classification}
          </Chip>
        </div>
      </div>
    </Card>
  );
}
