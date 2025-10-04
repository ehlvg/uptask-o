import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark" | "system";

export type AccentColor =
  | "default"
  | "purple"
  | "green"
  | "red"
  | "gold"
  | "blue"
  | "graphite"
  | "pink";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "uptask-theme-preference";
const ACCENT_COLOR_STORAGE_KEY = "uptask-accent-color";

// Accent color definitions with light and dark mode values
export const accentColors: Record<
  AccentColor,
  {
    name: string;
    light: { primary: string; ring: string };
    dark: { primary: string; ring: string };
    preview: string;
  }
> = {
  default: {
    name: "Default Orange",
    light: {
      primary: "oklch(0.705 0.213 47.604)",
      ring: "oklch(0.705 0.213 47.604)",
    },
    dark: {
      primary: "oklch(0.646 0.222 41.116)",
      ring: "oklch(0.646 0.222 41.116)",
    },
    preview: "#ff8c42",
  },
  purple: {
    name: "Purple Indigo",
    light: {
      primary: "oklch(0.55 0.25 280)",
      ring: "oklch(0.55 0.25 280)",
    },
    dark: {
      primary: "oklch(0.65 0.28 285)",
      ring: "oklch(0.65 0.28 285)",
    },
    preview: "#8b5cf6",
  },
  green: {
    name: "Royal Green",
    light: {
      primary: "oklch(0.5 0.18 155)",
      ring: "oklch(0.5 0.18 155)",
    },
    dark: {
      primary: "oklch(0.6 0.2 160)",
      ring: "oklch(0.6 0.2 160)",
    },
    preview: "#10b981",
  },
  red: {
    name: "Rich Red",
    light: {
      primary: "oklch(0.58 0.24 25)",
      ring: "oklch(0.58 0.24 25)",
    },
    dark: {
      primary: "oklch(0.68 0.25 25)",
      ring: "oklch(0.68 0.25 25)",
    },
    preview: "#ef4444",
  },
  gold: {
    name: "Gold",
    light: {
      primary: "oklch(0.65 0.18 75)",
      ring: "oklch(0.65 0.18 75)",
    },
    dark: {
      primary: "oklch(0.75 0.2 80)",
      ring: "oklch(0.75 0.2 80)",
    },
    preview: "#f59e0b",
  },
  blue: {
    name: "Deep Blue",
    light: {
      primary: "oklch(0.5 0.2 245)",
      ring: "oklch(0.5 0.2 245)",
    },
    dark: {
      primary: "oklch(0.6 0.22 250)",
      ring: "oklch(0.6 0.22 250)",
    },
    preview: "#3b82f6",
  },
  graphite: {
    name: "Graphite",
    light: {
      primary: "oklch(0.4 0.02 265)",
      ring: "oklch(0.4 0.02 265)",
    },
    dark: {
      primary: "oklch(0.65 0.03 265)",
      ring: "oklch(0.65 0.03 265)",
    },
    preview: "#6b7280",
  },
  pink: {
    name: "Barbie Pink",
    light: {
      primary: "oklch(0.65 0.27 345)",
      ring: "oklch(0.65 0.27 345)",
    },
    dark: {
      primary: "oklch(0.75 0.25 340)",
      ring: "oklch(0.75 0.25 340)",
    },
    preview: "#ec4899",
  },
};

function getSystemTheme(): "light" | "dark" {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function getStoredAccentColor(): AccentColor {
  const stored = localStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
  if (
    stored === "default" ||
    stored === "purple" ||
    stored === "green" ||
    stored === "red" ||
    stored === "gold" ||
    stored === "blue" ||
    stored === "graphite" ||
    stored === "pink"
  ) {
    return stored;
  }
  return "default";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme
  );
  const [accentColor, setAccentColorState] =
    useState<AccentColor>(getStoredAccentColor);

  // Calculate the actual theme to apply
  const actualTheme = theme === "system" ? systemTheme : theme;

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(actualTheme);
  }, [actualTheme]);

  // Apply accent color to document
  useEffect(() => {
    const root = document.documentElement;
    const colors = accentColors[accentColor];
    const themeColors = actualTheme === "dark" ? colors.dark : colors.light;

    root.style.setProperty("--primary", themeColors.primary);
    root.style.setProperty("--ring", themeColors.ring);
  }, [accentColor, actualTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, color);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, actualTheme, accentColor, setAccentColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
