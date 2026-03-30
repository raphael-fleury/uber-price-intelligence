import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabels?: boolean;
  lowLabel?: string;
  highLabel?: string;
}

const segmentColors = [
  "bg-semantic-emerald",
  "bg-semantic-lime",
  "bg-semantic-blue",
  "bg-semantic-orange",
  "bg-semantic-crimson",
];

export const Gauge = forwardRef<HTMLDivElement, GaugeProps>(
  ({ className, value, max = 5, showLabels = true, lowLabel = "Muito baixo", highLabel = "Muito alto", ...props }, ref) => {
    const normalizedValue = Math.max(1, Math.min(max, Math.round(value)));
    const segments = Array.from({ length: max }, (_, i) => i + 1);

    return (
      <div className={clsx("w-full", className)} ref={ref} {...props}>
        {showLabels && (
          <div className="flex justify-between text-xs text-on-surface-variant mb-3">
            <span>{lowLabel}</span>
            <span>{highLabel}</span>
          </div>
        )}
        <div className="flex gap-1">
          {segments.map((segment) => (
            <div
              key={segment}
              className={clsx(
                "h-3 flex-1 rounded-sm transition-opacity duration-300",
                segment <= normalizedValue
                  ? segmentColors[segment - 1]
                  : "bg-surface-variant",
                segment > normalizedValue && "opacity-30"
              )}
            />
          ))}
        </div>
        <div className="flex justify-center mt-2 gap-1">
          {segments.map((segment) => (
            <div
              key={segment}
              className={clsx(
                "w-2 h-2 rounded-full transition-all duration-300",
                segment <= normalizedValue
                  ? segmentColors[segment - 1]
                  : "bg-surface-variant"
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);

Gauge.displayName = "Gauge";
