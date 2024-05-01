import React, { createContext, useState } from 'react';
import useFetchBalance from './useFetchBalance';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  useFetchBalance();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};
