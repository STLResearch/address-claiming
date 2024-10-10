"use client";
import React, { createContext, useState } from "react";
import useFetchBalance from "./useFetchBalance";
import useInitAuth from "@/hooks/useInitAuth";
import useAutoLogout from "@/hooks/useAutoLogout";
import useTawk from "@/hooks/useTawk";

interface ContextI {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValue: ContextI = {
  isCollapsed: false,
  // eslint-disable-next-line no-empty-function
  setIsCollapsed: () => {},
};

export const SidebarContext = createContext<ContextI>(defaultValue);

export const SidebarProvider = ({ children }) => {
  useTawk();
  useInitAuth();
  useFetchBalance();

  useAutoLogout();

  const [isCollapsed, setIsCollapsed] = useState(false);

  return <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>{children}</SidebarContext.Provider>;
};
