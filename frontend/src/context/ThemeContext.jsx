import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "yummy_tema";
const ThemeContext = createContext(null);

function getSavedTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "escuro"
    ? "escuro"
    : "claro";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getSavedTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-tema", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const syncThemeBetweenTabs = (event) => {
      if (event.key === THEME_STORAGE_KEY) {
        setTheme(event.newValue === "escuro" ? "escuro" : "claro");
      }
    };

    window.addEventListener("storage", syncThemeBetweenTabs);
    return () => window.removeEventListener("storage", syncThemeBetweenTabs);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "escuro" ? "claro" : "escuro",
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }
  return context;
}
