"use client";
import React, { createContext, useEffect, useState } from "react";
import useFetchBalance from "./useFetchBalance";
import useInitAuth from "@/hooks/useInitAuth";
import useAutoLogout from "@/hooks/useAutoLogout";
import useTawk from "@/hooks/useTawk";

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  useTawk();
  useInitAuth();
  useFetchBalance();

  useAutoLogout();


  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};
