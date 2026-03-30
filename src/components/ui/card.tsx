import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type CardVariant = "elevated" | "section" | "glass";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  elevated: "bg-surface-lowest shadow-card",
  section: "bg-surface-high",
  glass: "bg-surface-variant/60 backdrop-blur-[20px] border border-outline/10",
};

const paddingStyles: Record<"none" | "sm" | "md" | "lg", string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "section", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-container",
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
