import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import { Chip } from "./ui/chip";

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

export default function PredictionHistory() {
  const predictions = useQuery(api.predictions.getPredictions);

  if (!predictions || predictions.length === 0) return null;

  return (
    <Card variant="section" padding="md">
      <h2 className="text-lg font-semibold text-on-surface mb-5 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        Consultas Recentes
      </h2>
      <div className="flex flex-col gap-3">
        {predictions.map((p) => {
          const level = Math.max(1, Math.min(5, p.classificationLevel));
          const formattedDate = new Date(`${p.date}T${p.time}`).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          });
          return (
            <Card key={p._id} variant="elevated" padding="sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-sm text-on-surface font-medium truncate">
                    <svg className="w-4 h-4 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">{p.origin}</span>
                    <svg className="w-3 h-3 text-on-surface-variant shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className="truncate">{p.destination}</span>
                  </div>
                  <p className="text-on-surface-variant text-xs mt-1">{formattedDate} às {p.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${levelDotColors[level]}`}></span>
                  <Chip variant="soft" color={levelColors[level]}>
                    {p.classification}
                  </Chip>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
