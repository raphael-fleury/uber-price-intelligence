import { useState } from "react";
import { Input, InputProps } from "./input";
import { TimePicker } from "./time-picker";

type TimeInputProps = InputProps & {
  value: string;
  setValue: (time: string) => void;
};

export function TimeInput({ value, setValue, ...props }: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTime = (time: string) => {
    setValue(time);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        type="time"
        value={value}
        placeholder="Selecione um horário"
        onClick={() => setIsOpen(true)}
        className="[&::-webkit-calendar-picker-indicator]:hidden"
        {...props}
      />

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-20">
          <TimePicker
            value={value}
            onChange={handleSelectTime}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
