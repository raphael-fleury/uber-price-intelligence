import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  handleClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, handleClear, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-on-surface-variant mb-1.5"
          >
            {label}
          </label>
        )}
        <div
          className={clsx(
            "bg-surface-low rounded-b-md border-b-2 border-transparent focus-within:border-primary focus-within:bg-surface transition-all relative",
            error && "border-semantic-crimson focus-within:border-semantic-crimson"
          )}
        >
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              "w-full px-4 py-3.5 bg-transparent text-on-surface placeholder-on-surface-variant/50 border-none outline-none transition-all",
              className
            )}
            {...props}
          />
          {handleClear && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-semantic-crimson mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
