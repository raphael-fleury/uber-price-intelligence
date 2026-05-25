import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { BarChart, type BarChartDataItem, type BarChartConfig } from "./bar-chart";

type HourlyPriceChartProps = {
  routeId?: Id<"userRoutes">;
  showCount?: boolean;
};

export function HourlyPriceChart({ routeId, showCount }: HourlyPriceChartProps) {
  const data = useQuery(api.rides.getAveragePriceByHourBand, { routeId, rideType: "uber_x" });
  const overallAveragePrice = useQuery(api.rides.getAveragePrice, { routeId, rideType: "uber_x" });

  // Mostrar variação apenas quando routeId não estiver presente
  const showVariation = !routeId && overallAveragePrice;

  if (!data || (showVariation && !overallAveragePrice)) {
    return <BarChart data={[]} config={{ title: "Carregando..." }} maxValue={100} />;
  }

  // Encontrar o preço máximo para escala
  const maxPrice = Math.max(...data.map(d => d.averagePrice), 0) || 100;

  // Transformar dados para o formato do BarChart
  const chartData: BarChartDataItem[] = data.map((item) => {
    const isVariation = showVariation && overallAveragePrice?.averagePrice;
    const displayValue = isVariation
      ? ((item.averagePrice - overallAveragePrice!.averagePrice) / overallAveragePrice!.averagePrice) * 100
      : item.averagePrice;

    return {
      key: item.hourStart,
      label: item.timeRange,
      value: item.averagePrice,
      displayValue: displayValue,
      rideCount: item.rideCount,
    };
  });

  // Configuração do gráfico
  const chartConfig: BarChartConfig = {
    title: showVariation ? "Variação de Preço por Hora do Dia" : "Preço Médio por Hora do Dia",
    subtitle: showVariation 
      ? "Variação percentual em relação à média de todas as rotas"
      : "Variação de preços ao longo do dia",
    legendText: showVariation
      ? "Os números abaixo mostram a variação percentual em relação à média"
      : undefined,
    showRideCount: showCount,
    tooltipFormatter: (val) => {
      if (showVariation) {
        return `${(val as number) > 0 ? "+" : ""}${(val as number).toFixed(1)}%`;
      }
      return `R$ ${(val as number).toFixed(2)}`;
    },
    valueFormatter: (val) => {
      if (showVariation) {
        return `${(val as number) > 0 ? "+" : ""}${(val as number).toFixed(1)}%`;
      }
      return `R$ ${(val as number).toFixed(2)}`;
    },
  };

  return <BarChart data={chartData} config={chartConfig} maxValue={maxPrice} />;
}
