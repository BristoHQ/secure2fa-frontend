// Available themes configuration
export const themes = {
  system: {
    name: "System Default",
    description: "Follows your system theme",
    type: "system",
  },
  light: {
    name: "Light Theme",
    description: "Clean and bright interface",
    type: "light",
  },
  dark: {
    name: "Dark Theme",
    description: "Easy on the eyes",
    type: "dark",
  },
  cyberpunk: {
    name: "Cyberpunk",
    description: "Neon-inspired security theme",
    type: "custom",
  },
  security: {
    name: "Security Pro",
    description: "Professional security interface",
    type: "custom",
  },
  ocean: {
    name: "Ocean Blue",
    description: "Deep ocean inspired theme",
    type: "custom",
  },
  forest: {
    name: "Forest Green",
    description: "Nature inspired security",
    type: "custom",
  },
};

// Theme utility functions
export const getStoredTheme = () => {
  return localStorage.getItem("secure2fa-theme");
};

export const setStoredTheme = (theme) => {
  localStorage.setItem("secure2fa-theme", theme);
};

export const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyThemeToDocument = (theme) => {
  const root = document.documentElement;

  // Remove all theme classes
  Object.keys(themes).forEach((themeKey) => {
    root.classList.remove(`theme-${themeKey}`);
  });

  // Handle system theme
  let effectiveTheme = theme;
  if (theme === "system") {
    effectiveTheme = getSystemTheme();
  }

  root.classList.add(`theme-${effectiveTheme}`);
  root.setAttribute("data-theme", effectiveTheme);

  return effectiveTheme;
};
