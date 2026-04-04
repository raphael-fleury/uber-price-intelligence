import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { clsx } from "clsx";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onClose?: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export function TimePicker({ value, onChange, onClose }: TimePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHour, setSelectedHour] = useState(() => {
    if (value) {
      const [h] = value.split(":").map(Number);
      return h;
    }
    return 12;
  });
  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (value) {
      const [, m] = value.split(":").map(Number);
      return m;
    }
    return 0;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    onChange(`${hour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    onChange(`${selectedHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
  };

  const scrollHourIntoView = (el: HTMLButtonElement | null) => {
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <div
      ref={containerRef}
      className="animate-fade-in bg-surface-lowest border border-outline/20 rounded-container shadow-lg p-4 w-[200px]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-secondary" />
        <span className="text-sm font-medium text-on-surface">Horário</span>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <span className="text-xs text-on-surface-variant mb-2 block text-center">Hora</span>
          <div className="h-32 overflow-y-auto scrollbar-hide">
            {HOURS.map((hour) => (
              <button
                key={hour}
                ref={selectedHour === hour ? scrollHourIntoView : undefined}
                type="button"
                onClick={() => handleHourSelect(hour)}
                className={clsx(
                  "w-full py-1.5 text-sm transition-colors",
                  selectedHour === hour
                    ? "bg-primary text-white font-semibold"
                    : "hover:bg-surface-variant text-on-surface"
                )}
              >
                {hour.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <span className="text-xs text-on-surface-variant mb-2 block text-center">Min</span>
          <div className="h-32 overflow-y-auto scrollbar-hide">
            {MINUTES.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => handleMinuteSelect(minute)}
                className={clsx(
                  "w-full py-1.5 text-sm transition-colors",
                  selectedMinute === minute
                    ? "bg-primary text-white font-semibold"
                    : "hover:bg-surface-variant text-on-surface"
                )}
              >
                {minute.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
