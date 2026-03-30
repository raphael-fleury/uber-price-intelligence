import { HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "default";
}

const sizeStyles = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-16 h-16 border-4",
};

const colorStyles = {
  primary: "border-primary border-t-primary",
  white: "border-white/30 border-t-white",
  default: "border-surface-variant border-t-primary",
};

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", color = "primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-full animate-spin",
          sizeStyles[size],
          colorStyles[color],
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";

interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  submessage?: string;
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, message, submessage, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col items-center gap-4", className)}
        {...props}
      >
        <div className="relative">
          <Spinner size="lg" color="default" />
          {children && (
            <div className="absolute inset-0 flex items-center justify-center">
              {children}
            </div>
          )}
        </div>
        {(message || submessage) && (
          <div className="text-center">
            {message && (
              <p className="text-on-surface font-medium">{message}</p>
            )}
            {submessage && (
              <p className="text-on-surface-variant text-sm mt-1">{submessage}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Loading.displayName = "Loading";
