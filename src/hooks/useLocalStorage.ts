import { useEffect, useRef, useState } from 'react';

type Initializer<T> = T | (() => T);

const isBrowser = typeof window !== 'undefined';

export function useLocalStorage<T>(key: string, initialValue: Initializer<T>) {
  const initialised = useRef(false);

  const resolveValue = () => {
    if (!isBrowser) {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const storedItem = window.localStorage.getItem(key);
      if (storedItem != null) {
        return JSON.parse(storedItem) as T;
      }
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}"`, error);
    }

    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  };

  const [value, setValue] = useState(resolveValue);

  useEffect(() => {
    if (!isBrowser || !initialised.current) {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist localStorage key "${key}"`, error);
    }
  }, [key, value]);

  useEffect(() => {
    initialised.current = true;
  }, []);

  return [value, setValue] as const;
}
