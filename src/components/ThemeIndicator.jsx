import React from "react";
import { useTheme } from "../hooks/useTheme";

const ThemeIndicator = () => {
  const { currentTheme, getEffectiveTheme } = useTheme();

  const getThemeIcon = (theme) => {
    switch (theme) {
      case "light":
        return "ri-sun-line";
      case "dark":
        return "ri-moon-line";
      case "cyberpunk":
        return "ri-flashlight-line";
      case "security":
        return "ri-shield-line";
      case "ocean":
        return "ri-drop-line";
      case "forest":
        return "ri-leaf-line";
      case "system":
        return "ri-computer-line";
      default:
        return "ri-palette-line";
    }
  };

  const getThemeName = (theme) => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "cyberpunk":
        return "Cyberpunk";
      case "security":
        return "Security Pro";
      case "ocean":
        return "Ocean Blue";
      case "forest":
        return "Forest Green";
      case "system":
        return "System";
      default:
        return "Custom";
    }
  };

  const effectiveTheme = getEffectiveTheme();
  const displayTheme =
    currentTheme === "system"
      ? `System (${getThemeName(effectiveTheme)})`
      : getThemeName(currentTheme);

  return (
    <div className="theme-indicator" title={`Current theme: ${displayTheme}`}>
      <i className={getThemeIcon(currentTheme)}></i>
      <span className="theme-name">{displayTheme}</span>
    </div>
  );
};

export default ThemeIndicator;
