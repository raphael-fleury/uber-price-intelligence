import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type ChipVariant = "default" | "soft";
type ChipColor = "default" | "emerald" | "lime" | "blue" | "orange" | "crimson";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
  color?: ChipColor;
}

const colorStyles: Record<ChipColor, { bg: string; text: string }> = {
  default: { bg: "bg-surface-highest", text: "text-on-surface-variant" },
  emerald: { bg: "bg-semantic-emerald/15", text: "text-semantic-emerald" },
  lime: { bg: "bg-semantic-lime/15", text: "text-semantic-lime" },
  blue: { bg: "bg-semantic-blue/15", text: "text-semantic-blue" },
  orange: { bg: "bg-semantic-orange/15", text: "text-semantic-orange" },
  crimson: { bg: "bg-semantic-crimson/15", text: "text-semantic-crimson" },
};

const variantStyles: Record<ChipVariant, string> = {
  default: "bg-surface-highest text-on-surface-variant border border-outline/15",
  soft: "",
};

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant = "default", color = "default", children, ...props }, ref) => {
    const colorStyle = colorStyles[color];

    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full",
          variantStyles[variant],
          colorStyle.bg,
          colorStyle.text,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Chip.displayName = "Chip";
