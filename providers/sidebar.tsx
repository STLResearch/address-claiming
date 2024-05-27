"use client";

import React, { createContext, useState } from "react";
import useFetchBalance from "@/hooks/useFetchBalance";
import useInitAuth from "@/hooks/useInitAuth";
import useAutoLogout from "@/hooks/useAutoLogout";
import useTawk from "@/hooks/useTawk";


export interface SidebarContextI {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContextI | null>(null);

export const Sidebar = ({ children }) => {
  useTawk();
  useInitAuth();
  useFetchBalance();
  useAutoLogout();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};
