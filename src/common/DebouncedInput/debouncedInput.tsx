import React, { useState, useEffect, useRef } from "react";

interface IDebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceDelay?: number;
  style?: React.CSSProperties;
  type?: string;
  disabled?: boolean;
}

const DebouncedInput: React.FC<IDebouncedInputProps> = ({
  value,
  onChange,
  debounceDelay = 500,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(event.target.value);
  };

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      onChange(displayValue);
    }, debounceDelay);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [displayValue, onChange, debounceDelay]);

  return <input value={displayValue} onChange={handleChange} {...props} />;
};

export default DebouncedInput;
