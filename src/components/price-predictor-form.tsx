import { useState } from "react";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Activity } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Loading } from "./ui/spinner";
import { DateInput } from "./ui/date-input";
import { TimeInput } from "./ui/time-input";
import { AddressInput } from "./ui/address-input";
import { PredictionData, PredictionFormData, predictionSchema } from "@/schemas/prediction.schema";

type Props = {
  onPrediction: (prediction: PredictionData) => void;
};

export default function PricePredictorForm({ onPrediction }: Props) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const predictPrice = useAction(api.predictions.predictPrice);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      date: "",
      time: "",
    },
  });

  const today = new Date().toISOString().split("T")[0];

  function updateValue<T>(field: keyof PredictionFormData) {
    return (value: T) => {
      setValue(field, value as any, { shouldValidate: true, shouldDirty: true });
    }
  }
  
  const onSubmit = async (data: PredictionFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await predictPrice(data);
      onPrediction(result);
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <AddressInput
            label="Origem"
            placeholder="Ex: Av. Paulista, São Paulo"
            value={watch("origin")}
            setValue={(value) => updateValue("origin")(value)}
            error={errors.origin?.message}
          />
          <AddressInput
            label="Destino"
            placeholder="Ex: Aeroporto de Congonhas"
            value={watch("destination")}
            setValue={(value) => updateValue("destination")(value)}
            error={errors.destination?.message}
          />
          <DateInput
            label="Data"
            min={today}
            value={watch("date")}
            setValue={(value) => updateValue("date")(value)}
            error={errors.date?.message}
            {...register("date")}
          />
          <TimeInput
            label="Horário"
            value={watch("time")}
            setValue={(value) => updateValue("time")(value)}
            error={errors.time?.message}
            {...register("time")}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!isValid}
          >
            Prever Preço
          </Button>
        </div>
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
