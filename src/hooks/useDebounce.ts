import { useState, useEffect } from "react";

// We use <T> (Generics) to make the hook universal
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the delayed value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the 'value' changes BEFORE the delay is over,
    // React calls this function to clear the old timer and start a new one.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // The effect re-runs every time 'value' or 'delay' changes

  return debouncedValue;
}
