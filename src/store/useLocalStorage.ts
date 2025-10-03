import { useState, useEffect } from "react";

const useLocalStorage = (key: string, initialValue: any) => {
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setState(JSON.parse(item));
    }
  }, [key]);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

export default useLocalStorage;
