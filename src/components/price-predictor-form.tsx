import { useState } from "react";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Activity } from "lucide-react";
import { z } from "zod";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loading } from "./ui/spinner";

const predictionSchema = z.object({
  origin: z.string().min(1, "Informe a origem"),
  destination: z.string().min(1, "Informe o destino"),
  date: z.string().min(1, "Informe a data"),
  time: z.string().min(1, "Informe o horário"),
});

type PredictionFormData = z.infer<typeof predictionSchema>;

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
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const predictPrice = useAction(api.predictions.predictPrice);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
      time: "",
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: PredictionFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await predictPrice(data);
      onPrediction({
        data: result as PredictionData,
        ...data,
      });
    } catch (err) {
      setServerError("Erro ao processar a previsão. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="section" padding="md">
      <h2 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-3.5 h-3.5 text-primary" />
        </span>
        Detalhes da Corrida
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <Input
            type="text"
            label="Origem"
            error={errors.origin?.message}
            placeholder="Ex: Av. Paulista, São Paulo"
            {...register("origin")}
          />
          <Input
            type="text"
            label="Destino"
            error={errors.destination?.message}
            placeholder="Ex: Aeroporto de Congonhas"
            {...register("destination")}
          />
          <Input
            type="date"
            label="Data"
            min={today}
            error={errors.date?.message}
            {...register("date")}
          />
          <Input
            type="time"
            label="Horário"
            error={errors.time?.message}
            {...register("time")}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!isValid}
        >
          Prever Preço
        </Button>
      </form>

      {serverError && (
        <p className="text-semantic-crimson text-sm text-center font-medium mt-4">{serverError}</p>
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
