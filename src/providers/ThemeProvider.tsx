import {createContext, useContext, useEffect, useState, useMemo, useCallback} from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode,
  defaultTheme?: Theme,
  storageKey?: string,
}

type ThemeProviderState = {
  theme: Theme,
  setThemePreference: (theme: Theme) => void;
}

const getSystemTheme = (fallback: Theme): Theme => {
  if (typeof window === "undefined") return fallback;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

const getStoredTheme = (storageKey: string): Theme | null => {
  const v = localStorage.getItem(storageKey);
  if (v === "dark" || v === "light") return v;
  return null;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey="ui-theme",
}: ThemeProviderProps) {

  //if theme key in local storage, use it, otherwise follow browser preference
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = typeof window === "undefined" ? null : getStoredTheme(storageKey);
    return stored ?? getSystemTheme(defaultTheme);
  });


  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark")
  }, [theme])


  // useCallback ensures function's reference remains stable so it can be safely
  // included in dependency arrays (useMemo below) without causing unnecessary
  // re-renders of context consumers.
  const setThemePreference = useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme);
      setTheme(nextTheme);
    },
    [storageKey]
  )

  // Memoize the context value to preserve referential stability.
  // Without useMemo, a new object would be created on every render,
  // triggering re-renders in all consumers even when theme values
  // have not changed.
  const value = useMemo(
    () => ({ theme, setThemePreference }),
    [theme, setThemePreference]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context 
}
