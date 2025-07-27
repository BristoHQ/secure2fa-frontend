import React, { createContext, useEffect, useState } from "react";
import {
  themes,
  getStoredTheme,
  setStoredTheme,
  getSystemTheme,
  applyThemeToDocument,
} from "../utils/themeUtils";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = getStoredTheme();
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Detect system preference
      const systemTheme = getSystemTheme();
      setCurrentTheme(systemTheme);
    }
    setIsLoading(false);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isLoading) return;

    applyThemeToDocument(currentTheme);

    // Listen for system theme changes if using system theme
    if (currentTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyThemeToDocument("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [currentTheme, isLoading]);

  const changeTheme = (theme) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
      setStoredTheme(theme);
    }
  };

  const getEffectiveTheme = () => {
    if (currentTheme === "system") {
      return getSystemTheme();
    }
    return currentTheme;
  };

  const value = {
    currentTheme,
    themes,
    changeTheme,
    getEffectiveTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
