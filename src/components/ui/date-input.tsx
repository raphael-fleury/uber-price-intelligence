import { useDatePicker } from "@rehookify/datepicker";
import { useState } from "react";
import { Input, InputProps } from "./input";
import { DatePicker } from "./date-picker";

interface DateInputProps extends Omit<InputProps, "type"> {}

export function DateInput(props: DateInputProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleSelectDate = (dates: Date[]) => {
    setSelectedDates(dates);
    setIsCalendarOpen(false);
  }

  return (
    <div>
      <Input
        type="date"
        value={selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : ""}
        placeholder="Selecione uma data"
        onClick={() => setIsCalendarOpen(true)}
        {...props}
      />

      {isCalendarOpen && (
        <DatePicker
          selectedDates={selectedDates}
          onDatesChange={handleSelectDate}
        />
      )}
    </div>
  );
}