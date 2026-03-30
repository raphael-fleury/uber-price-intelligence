import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const levelColors: Record<number, string> = {
  1: "text-emerald-400",
  2: "text-lime-400",
  3: "text-blue-400",
  4: "text-orange-400",
  5: "text-red-400",
};

const levelEmojis: Record<number, string> = {
  1: "🟢",
  2: "🟡",
  3: "🔵",
  4: "🟠",
  5: "🔴",
};

export default function PredictionHistory() {
  const predictions = useQuery(api.predictions.getPredictions);

  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <span className="text-slate-400">🕘</span>
        Consultas Recentes
      </h2>
      <div className="flex flex-col gap-3">
        {predictions.map((p) => {
          const level = Math.max(1, Math.min(5, p.classificationLevel)) as 1 | 2 | 3 | 4 | 5;
          const formattedDate = new Date(`${p.date}T${p.time}`).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          });
          return (
            <div
              key={p._id}
              className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm text-white font-medium truncate">
                  <span className="text-slate-500 shrink-0">📍</span>
                  <span className="truncate">{p.origin}</span>
                  <span className="text-slate-500 shrink-0">→</span>
                  <span className="truncate">{p.destination}</span>
                </div>
                <p className="text-slate-500 text-xs mt-1">{formattedDate} às {p.time}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span>{levelEmojis[level]}</span>
                <span className={`text-xs font-semibold ${levelColors[level]}`}>
                  {p.classification}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

