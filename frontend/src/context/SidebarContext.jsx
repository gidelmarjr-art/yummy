import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext(null);
const STORAGE_KEY = "yummy_sidebar_open";

function getInitialState() {
  const savedValue = localStorage.getItem(STORAGE_KEY);
  return savedValue === null ? true : savedValue === "true";
}

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => setIsOpen((open) => !open);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar deve ser usado dentro de SidebarProvider.");
  return context;
}
