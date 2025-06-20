import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [seances, setSeances] = useState([]);
  return (
    <SidebarContext.Provider value={{ seances, setSeances }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
