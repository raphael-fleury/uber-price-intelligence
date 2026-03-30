type PredictionData = {
  classification: string;
  classificationLevel: number;
  reasoning: string;
  factors: string[];
};

type Props = {
  result: PredictionData;
  origin: string;
  destination: string;
  date: string;
  time: string;
};

const levelConfig = {
  1: {
    label: "Muito abaixo do normal",
    emoji: "🟢",
    bg: "bg-emerald-900/30",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    bar: "bg-emerald-500",
    barWidth: "w-1/5",
    description: "Ótimo momento para pegar uma corrida!",
  },
  2: {
    label: "Abaixo do normal",
    emoji: "🟡",
    bg: "bg-lime-900/30",
    border: "border-lime-500/40",
    text: "text-lime-400",
    badge: "bg-lime-500/20 text-lime-300 border-lime-500/30",
    bar: "bg-lime-500",
    barWidth: "w-2/5",
    description: "Preço favorável para sua corrida.",
  },
  3: {
    label: "Na média",
    emoji: "🔵",
    bg: "bg-blue-900/30",
    border: "border-blue-500/40",
    text: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    bar: "bg-blue-500",
    barWidth: "w-3/5",
    description: "Preço dentro do esperado.",
  },
  4: {
    label: "Acima do normal",
    emoji: "🟠",
    bg: "bg-orange-900/30",
    border: "border-orange-500/40",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    bar: "bg-orange-500",
    barWidth: "w-4/5",
    description: "Considere aguardar um pouco.",
  },
  5: {
    label: "Muito acima do normal",
    emoji: "🔴",
    bg: "bg-red-900/30",
    border: "border-red-500/40",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
    bar: "bg-red-500",
    barWidth: "w-full",
    description: "Alta demanda! Preço elevado no momento.",
  },
};

export default function PredictionResult({ result, origin, destination, date, time }: Props) {
  const level = Math.max(1, Math.min(5, result.classificationLevel)) as 1 | 2 | 3 | 4 | 5;
  const config = levelConfig[level];

  const formattedDate = new Date(`${date}T${time}`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className={`${config.bg} border ${config.border} rounded-2xl p-6 backdrop-blur-sm shadow-xl animate-fade-in`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">Previsão de Preço</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.emoji}</span>
            <h3 className={`text-xl font-bold ${config.text}`}>{config.label}</h3>
          </div>
          <p className="text-slate-400 text-sm mt-1">{config.description}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${config.badge}`}>
          Nível {level}/5
        </span>
      </div>

      {/* Price Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Muito baixo</span>
          <span>Muito alto</span>
        </div>
        <div className="h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.bar} rounded-full transition-all duration-700`}
            style={{ width: `${(level / 5) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {[1, 2, 3, 4, 5].map((l) => (
            <div
              key={l}
              className={`w-2 h-2 rounded-full ${l <= level ? config.bar : "bg-slate-700"} transition-all`}
            />
          ))}
        </div>
      </div>

      {/* Route Info */}
      <div className="bg-slate-900/40 rounded-xl p-4 mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 w-4">📍</span>
          <span className="text-slate-400 w-16 shrink-0">Origem:</span>
          <span className="text-white font-medium truncate">{origin}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 w-4">🏁</span>
          <span className="text-slate-400 w-16 shrink-0">Destino:</span>
          <span className="text-white font-medium truncate">{destination}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 w-4">🕐</span>
          <span className="text-slate-400 w-16 shrink-0">Quando:</span>
          <span className="text-white font-medium capitalize">{formattedDate} às {time}</span>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Análise</p>
        <p className="text-slate-300 text-sm leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Factors */}
      {result.factors && result.factors.length > 0 && (
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Fatores Identificados</p>
          <div className="flex flex-wrap gap-2">
            {result.factors.map((factor, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

