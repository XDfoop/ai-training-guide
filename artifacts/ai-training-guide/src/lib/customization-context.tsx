import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColor = "zinc" | "indigo" | "emerald" | "violet" | "orange" | "rose" | "cyan";
type FontSize = "sm" | "md" | "lg" | "xl";
type LayoutPreference = "sidebar" | "top-nav";
type ColorScheme = "light" | "dark" | "system";

interface CustomizationState {
  themeColor: ThemeColor;
  fontSize: FontSize;
  layout: LayoutPreference;
  readingMode: boolean;
  colorScheme: ColorScheme;
}

interface CustomizationContextType extends CustomizationState {
  setThemeColor: (color: ThemeColor) => void;
  setFontSize: (size: FontSize) => void;
  setLayout: (layout: LayoutPreference) => void;
  setReadingMode: (mode: boolean) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CustomizationState>(() => {
    const saved = localStorage.getItem("app-settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      themeColor: "zinc",
      fontSize: "md",
      layout: "sidebar",
      readingMode: false,
      colorScheme: "system",
    };
  });

  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(state));

    const root = window.document.documentElement;
    
    // Handle dark mode
    root.classList.remove("light", "dark");
    if (state.colorScheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(state.colorScheme);
    }

    // Handle theme color
    const themes = ["theme-indigo", "theme-emerald", "theme-violet", "theme-orange", "theme-rose", "theme-cyan"];
    root.classList.remove(...themes);
    if (state.themeColor !== "zinc") {
      root.classList.add(`theme-${state.themeColor}`);
    }

    // Handle font size
    const sizes = ["text-size-sm", "text-size-md", "text-size-lg", "text-size-xl"];
    root.classList.remove(...sizes);
    root.classList.add(`text-size-${state.fontSize}`);
    
  }, [state]);

  const updateState = (updates: Partial<CustomizationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <CustomizationContext.Provider
      value={{
        ...state,
        setThemeColor: (c) => updateState({ themeColor: c }),
        setFontSize: (s) => updateState({ fontSize: s }),
        setLayout: (l) => updateState({ layout: l }),
        setReadingMode: (m) => updateState({ readingMode: m }),
        setColorScheme: (s) => updateState({ colorScheme: s }),
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (!context) throw new Error("useCustomization must be used within a CustomizationProvider");
  return context;
}
