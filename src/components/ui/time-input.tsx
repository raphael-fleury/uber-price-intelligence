import { useState } from "react";
import { Input, InputProps } from "./input";
import { TimePicker } from "./time-picker";

type TimeInputProps = InputProps & {
  value?: string;
};

export function TimeInput({ value = "", ...props }: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const handleSelectTime = (time: string) => {
    setInternalValue(time);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        type="time"
        value={internalValue}
        placeholder="Selecione um horário"
        onClick={() => setIsOpen(true)}
        className="[&::-webkit-calendar-picker-indicator]:hidden"
        {...props}
      />

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-20">
          <TimePicker
            value={internalValue}
            onChange={handleSelectTime}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
