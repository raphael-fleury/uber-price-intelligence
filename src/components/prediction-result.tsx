import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Chip } from "./ui/chip";
import { Gauge } from "./ui/gauge";

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

type LevelConfig = {
  label: string;
  bgColor: string;
  textColor: string;
  chipColor: "emerald" | "lime" | "blue" | "orange" | "crimson";
  description: string;
};

const levelConfig: Record<number, LevelConfig> = {
  1: {
    label: "Muito abaixo do normal",
    bgColor: "bg-semantic-emerald/10",
    textColor: "text-semantic-emerald",
    chipColor: "emerald",
    description: "Ótimo momento para pegar uma corrida!",
  },
  2: {
    label: "Abaixo do normal",
    bgColor: "bg-semantic-lime/10",
    textColor: "text-semantic-lime",
    chipColor: "lime",
    description: "Preço favorável para sua corrida.",
  },
  3: {
    label: "Na média",
    bgColor: "bg-semantic-blue/10",
    textColor: "text-semantic-blue",
    chipColor: "blue",
    description: "Preço dentro do esperado.",
  },
  4: {
    label: "Acima do normal",
    bgColor: "bg-semantic-orange/10",
    textColor: "text-semantic-orange",
    chipColor: "orange",
    description: "Considere aguardar um pouco.",
  },
  5: {
    label: "Muito acima do normal",
    bgColor: "bg-semantic-crimson/10",
    textColor: "text-semantic-crimson",
    chipColor: "crimson",
    description: "Alta demanda! Preço elevado no momento.",
  },
};

export default function PredictionResult({ result, origin, destination, date, time }: Props) {
  const level = Math.max(1, Math.min(5, result.classificationLevel));
  const config = levelConfig[level];

  const formattedDate = new Date(`${date}T${time}`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <Card variant="glass" padding="md" className={`${config.bgColor} animate-fade-in`}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-on-surface-variant text-xs uppercase tracking-wider font-medium mb-1">Previsão de Preço</p>
          <div className="flex items-center gap-2">
            <h3 className={`text-xl font-display font-bold ${config.textColor}`}>{config.label}</h3>
          </div>
          <p className="text-on-surface-variant text-sm mt-1">{config.description}</p>
        </div>
        <Chip variant="soft" color={config.chipColor}>
          Nível {level}/5
        </Chip>
      </div>

      <div className="mb-5">
        <Gauge value={level} />
      </div>

      <Card variant="section" padding="sm" className="mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-secondary shrink-0" />
            <span className="text-on-surface-variant w-16 shrink-0">Origem:</span>
            <span className="text-on-surface font-medium truncate">{origin}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ArrowRight className="w-4 h-4 text-primary shrink-0" />
            <span className="text-on-surface-variant w-16 shrink-0">Destino:</span>
            <span className="text-on-surface font-medium truncate">{destination}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-on-surface-variant shrink-0" />
            <span className="text-on-surface-variant w-16 shrink-0">Quando:</span>
            <span className="text-on-surface font-medium capitalize">{formattedDate} às {time}</span>
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <p className="text-on-surface-variant text-xs uppercase tracking-wider font-medium mb-2">Análise</p>
        <p className="text-on-surface text-sm leading-relaxed">{result.reasoning}</p>
      </div>

      {result.factors && result.factors.length > 0 && (
        <div>
          <p className="text-on-surface-variant text-xs uppercase tracking-wider font-medium mb-2">Fatores Identificados</p>
          <div className="flex flex-wrap gap-2">
            {result.factors.map((factor, i) => (
              <Chip key={i} variant="default">
                {factor}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
