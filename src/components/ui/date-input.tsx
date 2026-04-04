import { useState } from "react";
import { Input, InputProps } from "./input";
import { DatePicker } from "./date-picker";

type DateInputProps = InputProps & {
  value: string;
  setValue: (date: string) => void;
};

export function DateInput({ value, setValue, ...props }: DateInputProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleSelectDate = (dates: Date[]) => {
    setValue(dates[0].toISOString().split("T")[0]);
    setSelectedDates(dates);
    setIsCalendarOpen(false);
  }

  const minDate = props.min === undefined ? undefined : new Date(props.min);
  const maxDate = props.max === undefined ? undefined : new Date(props.max);

  return (
    <div>
      <Input
        type="date"
        value={value}
        placeholder="Selecione uma data"
        onClick={() => setIsCalendarOpen(true)}
        className="[&::-webkit-calendar-picker-indicator]:hidden"
        {...props}
      />

      {isCalendarOpen && (
        <DatePicker
          selectedDates={selectedDates}
          onDatesChange={handleSelectDate}
          onClose={() => setIsCalendarOpen(false)}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </div>
  );
}