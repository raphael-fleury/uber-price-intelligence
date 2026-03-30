import { useState } from "react";
import { useAction } from "convex/react";
import { MapPin, Activity } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loading } from "./ui/spinner";

type PredictionData = {
  classification: string;
  classificationLevel: number;
  reasoning: string;
  factors: string[];
};

type Props = {
  onPrediction: (prediction: {
    data: PredictionData;
    origin: string;
    destination: string;
    date: string;
    time: string;
  }) => void;
};

export default function PricePredictorForm({ onPrediction }: Props) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictPrice = useAction(api.predictions.predictPrice);

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination || !date || !time) return;

    setLoading(true);
    setError(null);

    try {
      const data = await predictPrice({ origin, destination, date, time });
      onPrediction({
        data: data as PredictionData,
        origin,
        destination,
        date,
        time,
      });
    } catch (err) {
      setError("Erro ao processar a previsão. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="section" padding="md">
      <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-primary" />
        </span>
        Detalhes da Corrida
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <Input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            label="Origem"
            placeholder="Ex: Av. Paulista, São Paulo"
            required
          />
          <Input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            label="Destino"
            placeholder="Ex: Aeroporto de Congonhas"
            required
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            label="Data"
            min={today}
            required
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            label="Horário"
            required
          />
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!origin || !destination || !date || !time}
        >
          Prever Preço
        </Button>
      </form>

      {error && (
        <p className="text-semantic-crimson text-sm text-center font-medium mt-4">{error}</p>
      )}

      {loading && (
        <div className="mt-6">
          <Loading
            message="Analisando dados históricos..."
            submessage="Verificando padrões de preço, horário e condições"
          >
            <Activity className="w-7 h-7 text-primary" />
          </Loading>
        </div>
      )}
    </Card>
  );
}
