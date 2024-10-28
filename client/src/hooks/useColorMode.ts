"use client"
import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);

    if (colorMode === 'dark') {
      localStorage.setItem('color', 'dark');
    } else {
      localStorage.setItem('color','light');
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;