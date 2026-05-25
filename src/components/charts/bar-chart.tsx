import { Card } from "../ui/card";

export type BarChartDataItem = {
  key: string | number;
  label: string;
  value: number;
  displayValue: string | number;
  rideCount?: number;
};

export type BarChartConfig = {
  title: string;
  subtitle?: string;
  legendText?: string;
  emptyText?: string;
  maxHeight?: number;
  showRideCount?: boolean;
  tooltipFormatter?: (displayValue: string | number) => string;
  valueFormatter?: (displayValue: string | number) => string;
};

type BarChartProps = {
  data: BarChartDataItem[];
  config: BarChartConfig;
  maxValue: number;
};

export function BarChart({ data, config, maxValue }: BarChartProps) {
  const {
    title,
    subtitle,
    legendText,
    emptyText = "Nenhum dado disponível",
    maxHeight = 40,
    showRideCount = false,
    tooltipFormatter = (val) => String(val),
    valueFormatter = (val) => String(val),
  } = config;

  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  const hasData = data.some((item) => item.rideCount ? item.rideCount > 0 : true);

  return (
    <Card variant="glass" padding="lg">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-on-surface mb-2">{title}</h3>
          {subtitle && <p className="text-xs text-on-surface-variant/60">{subtitle}</p>}
        </div>

        {/* Chart */}
        {hasData ? (
          <div className="flex items-end justify-between gap-2 h-40">
            {data.map((item) => {
              const height = getBarHeight(item.value);
              const itemHasData = item.rideCount ? item.rideCount > 0 : true;

              return (
                <div
                  key={item.key}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  {/* Bar */}
                  <div className="w-full flex items-end justify-center h-32 relative group">
                    {itemHasData ? (
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-semantic-blue to-semantic-blue/70 transition-all duration-200 hover:opacity-80 cursor-pointer relative"
                        style={{ height: `${height}%` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-on-surface text-surface-lowest px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {tooltipFormatter(item.displayValue)}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-1 bg-surface-variant rounded"></div>
                    )}
                  </div>

                  {/* Label and Value */}
                  <div className="text-center">
                    <p className="text-xs font-medium text-on-surface">{item.label}</p>
                    <p className="text-xs text-on-surface-variant/60">
                      {itemHasData ? valueFormatter(item.displayValue) : "sem dados"}
                    </p>
                    {showRideCount && item.rideCount ? (
                      <p className="text-xs text-on-surface-variant/40">
                        ({item.rideCount} {item.rideCount === 1 ? "corrida" : "corridas"})
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-on-surface-variant/60">
            <p className="text-sm">{emptyText}</p>
          </div>
        )}

        {/* Legend */}
        {legendText && (
          <div className="pt-4 border-t border-outline/10">
            <div className="text-xs text-on-surface-variant/60">
              <p>{legendText}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
