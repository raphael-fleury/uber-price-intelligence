import { useState } from "react";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { DateInput } from "./ui/date-input";
import { TimeInput } from "./ui/time-input";
import { AddressInput } from "./ui/address-input";
import { useLocationStore } from "../stores/location-store";
import { PredictionData, PredictionFormData, predictionSchema } from "@/schemas/prediction.schema";
import { locationSchema } from "@/schemas/location.schema";

type Props = {
  onPrediction: (prediction: PredictionData) => void;
  onLoadingChange?: (loading: boolean) => void;
};

export default function PricePredictorForm({ onPrediction, onLoadingChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const updateLoading = (value: boolean) => {
    setLoading(value);
    onLoadingChange?.(value);
  };
  
  const { origin, destination, clearLocations } = useLocationStore();

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
      originId: 0,
      destinationId: 0,
      date: "",
      time: "",
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: PredictionFormData) => {
    updateLoading(true);
    setServerError(null);

    try {
      if (!origin || !destination) {
        setServerError("Selecione origem e destino.");
        updateLoading(false);
        return;
      }

      const result = await predictPrice({
        origin: locationSchema.parse(origin),
        destination: locationSchema.parse(destination),
        date: data.date,
        time: data.time,
      });
      onPrediction(result);
    } catch (err) {
      setServerError("Erro ao processar a previsão. Tente novamente.");
      console.error(err);
    } finally {
      updateLoading(false);
    }
  };

  const hasOrigin = !!origin;
  const hasDestination = !!destination;
  const canSubmit = isValid && hasOrigin && hasDestination;

  function updateValue<T>(field: keyof PredictionFormData) {
    return (value: T) => {
      setValue(field, value as any, { shouldValidate: true, shouldDirty: true });
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 items-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <AddressInput
            label="Origem"
            placeholder="Ex: Av. Paulista, São Paulo"
            value={origin}
            onSelect={(loc) => {
              useLocationStore.getState().setOrigin(loc);
              updateValue("originId")(loc?.place_id || 0);
            }}
            error={errors.originId ? "Selecione a origem" : undefined}
          />
          <AddressInput
            label="Destino"
            placeholder="Ex: Aeroporto de Congonhas"
            value={destination}
            onSelect={(loc) => {
              useLocationStore.getState().setDestination(loc);
              updateValue("destinationId")(loc?.place_id || 0);
            }}
            error={errors.destinationId ? "Selecione o destino" : undefined}
          />
          <DateInput
            label="Data"
            min={today}
            value={watch("date")}
            setValue={updateValue("date")}
            error={errors.date?.message}
          />
          <TimeInput
            label="Horário"
            value={watch("time")}
            setValue={updateValue("time")}
            error={errors.time?.message}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              clearLocations();
              reset();
            }}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!canSubmit}
          >
            Prever Preço
          </Button>
        </div>
      </form>

      {serverError && (
        <p className="text-semantic-crimson text-sm text-center font-medium mt-4">{serverError}</p>
      )}
    </Card>
  );
}