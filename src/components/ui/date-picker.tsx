import React, { useRef, useEffect } from "react";
import { useDatePicker } from "@rehookify/datepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface DatePickerProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const DatePicker = ({ selectedDates, onDatesChange, onClose, minDate, maxDate }: DatePickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetDate, setOffsetDate] = React.useState<Date>(new Date());

  const {
    data: { calendars },
    propGetters: {
      dayButton,
      addOffset,
      subtractOffset,
    },
  } = useDatePicker({
    selectedDates,
    onDatesChange: (dates) => {
      onDatesChange(dates);
      onClose?.();
    },
    offsetDate,
    onOffsetChange: setOffsetDate,
    dates: {
      toggle: true,
      minDate,
      maxDate,
    },
  });

  const handleDayClick = (dpDay: any) => {
    const props = dayButton(dpDay);
    if (props.onClick) {
      props.onClick({} as React.MouseEvent<HTMLElement>);
    }
    onClose?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const { days } = calendars[0];
  const monthName = format(offsetDate, "MMMM yyyy", { locale: ptBR });

  const prevButton = subtractOffset({ months: 1 });
  const nextButton = addOffset({ months: 1 });

  return (
    <div ref={containerRef} className="animate-fade-in bg-surface-lowest border border-outline/20 rounded-container shadow-lg p-4 w-[320px] absolute z-10">
      <div className="flex items-center justify-between mb-4">
        {prevButton.disabled ? (
          <div className="w-9" />
        ) : (
          <button
            {...prevButton}
            className="p-1.5 hover:bg-surface-variant rounded-full transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface" />
          </button>
        )}
        <span className="font-semibold text-on-surface capitalize">
          {monthName}
        </span>
        {nextButton.disabled ? (
          <div className="w-9" />
        ) : (
          <button
            {...nextButton}
            className="p-1.5 hover:bg-surface-variant rounded-full transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5 text-on-surface" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-on-surface-variant py-2"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dpDay) => {
          const isSelected = dpDay.selected;
          const isToday = dpDay.now;
          const isDisabled = dpDay.disabled;
          const date = dpDay.$date.toISOString().split("T")[0];

          return (
            <div key={date} className="aspect-square flex items-center justify-center">
              {dpDay.inCurrentMonth ? (
                <button
                  type="button"
                  onClick={() => !isDisabled && handleDayClick(dpDay)}
                  disabled={isDisabled}
                  className={clsx(
                    "w-8 h-8 text-sm rounded-full flex items-center justify-center transition-all",
                    isSelected && !isDisabled
                      ? "bg-primary text-white font-semibold"
                      : isDisabled
                      ? "text-on-surface-variant/40 cursor-not-allowed"
                      : "hover:bg-surface-variant text-on-surface",
                    isToday && !isSelected && !isDisabled && "border border-primary"
                  )}
                >
                  {dpDay.day}
                </button>
              ) : (
                <span className="w-8 h-8" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
