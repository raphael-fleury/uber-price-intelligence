import { useQuery } from "convex/react";
import { Card } from "../ui/card";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type WeeklyPriceChartProps = {
  routeId?: Id<"userRoutes">;
  showCount?: boolean;
};

export function WeeklyPriceChart({ routeId, showCount }: WeeklyPriceChartProps) {
  const data = useQuery(api.rides.getAveragePriceByWeekday, { routeId, rideTypeFilter: "uber_x" });
  const overallAveragePrice = useQuery(api.rides.getAveragePrice, { routeId, rideType: "uber_x" });

  // Mostrar variação apenas quando routeId não estiver presente
  const showVariation = !routeId && overallAveragePrice;

  if (!data || (showVariation && !overallAveragePrice)) {
    return (
      <Card variant="glass" padding="lg" className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-on-surface-variant">
          <p className="text-sm">Carregando dados...</p>
        </div>
      </Card>
    );
  }

  // Encontrar o preço máximo para escala
  const maxPrice = Math.max(...data.map(d => d.averagePrice), 0) || 100;

  // Calcular altura das barras (em percentual)
  const getBarHeight = (price: number) => {
    if (maxPrice === 0) return 0;
    return (price / maxPrice) * 100;
  };

  // Calcular valor a exibir (variação percentual ou preço absoluto)
  const getDisplayValue = (item: typeof data[0]) => {
    if (showVariation && overallAveragePrice?.averagePrice) {
      return ((item.averagePrice - overallAveragePrice.averagePrice) / overallAveragePrice.averagePrice) * 100;
    }
    return item.averagePrice;
  };

  // Abreviar nomes dos dias
  const dayAbbrev = {
    "Domingo": "Dom",
    "Segunda": "Seg",
    "Terça": "Ter",
    "Quarta": "Qua",
    "Quinta": "Qui",
    "Sexta": "Sex",
    "Sábado": "Sab",
  } as Record<string, string>;

  return (
    <Card variant="glass" padding="lg">
      <div className="flex flex-col gap-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-on-surface mb-2">
            {showVariation ? "Variação de Preço por Dia da Semana" : "Preço Médio por Dia da Semana"}
          </h3>
          <p className="text-xs text-on-surface-variant/60">
            {showVariation 
              ? "Variação percentual em relação à média de todas as rotas"
              : "Variação de preços ao longo da semana"}
          </p>
        </div>

        {data.some(d => d.rideCount > 0) ? (
          <div className="flex items-end justify-between gap-2 h-40">
            {data.map((item) => {
              const height = getBarHeight(item.averagePrice);
              const hasData = item.rideCount > 0;
              const displayValue = getDisplayValue(item);

              return (
                <div
                  key={item.dayIndex}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end justify-center h-32 relative group">
                    {hasData ? (
                      <>
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-semantic-blue to-semantic-blue/70 transition-all duration-200 hover:opacity-80 cursor-pointer relative"
                          style={{ height: `${height}%` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface-lowest px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {showVariation 
                              ? `${displayValue > 0 ? "+" : ""}${displayValue.toFixed(1)}%`
                              : `R$ ${item.averagePrice.toFixed(2)}`}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-1 bg-surface-variant rounded"></div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs font-medium text-on-surface">
                      {dayAbbrev[item.weekday as keyof typeof dayAbbrev]}
                    </p>
                    <p className="text-xs text-on-surface-variant/60">
                      {hasData 
                        ? showVariation
                          ? `${displayValue > 0 ? "+" : ""}${displayValue.toFixed(1)}%`
                          : `R$ ${item.averagePrice.toFixed(2)}`
                        : "sem dados"}
                    </p>
                    {showCount && (
                      <p className="text-xs text-on-surface-variant/40">
                        ({item.rideCount} {item.rideCount === 1 ? "corrida" : "corridas"})
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-on-surface-variant/60">
            <p className="text-sm">Nenhum dado disponível para esta rota</p>
          </div>
        )}

        {/* Legenda */}
        <div className="pt-4 border-t border-outline/10">
          {showVariation ? (
            <div className="text-xs text-on-surface-variant/60">
              <p>Os números abaixo mostram a variação percentual em relação à média</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
              <div className="w-3 h-3 bg-gradient-to-t from-semantic-blue to-semantic-blue/70 rounded"></div>
              <span>Preço médio estimado</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
