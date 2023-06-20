/**
 * @description: this file contains the code for the local storage hook which is used to retreieve and store data on local storage
 */
import { useState } from "react";

/**
 * @description: this function is the local storage hook
 * @param key
 * @param defaultValue
 * @returns
 */
const useLocalStorage = (key: string, defaultValue: string) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      console.log(key, value);
      if (value) {
        return JSON.parse(value);
      }

      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });
  const setValue = (newValue: string) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (e) {
      console.log(e);
    }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
