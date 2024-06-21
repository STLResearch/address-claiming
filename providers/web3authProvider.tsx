"use client";

import store from "@/redux/store";
import React, { createContext, useState, ReactNode } from "react";
import { Provider } from "react-redux";
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";

interface Web3authContextType {
  web3auth: any;
  setWeb3auth: React.Dispatch<React.SetStateAction<any>>;
  provider: any;
  setProvider: React.Dispatch<React.SetStateAction<any>>;
}

const defaultValue: Web3authContextType = {
  web3auth: null,
  setWeb3auth: () => {},
  provider: null,
  setProvider: () => {},
};

export const Web3authContext = createContext<Web3authContextType>(defaultValue);

interface Web3authProviderProps {
  children: ReactNode;
}

// const persistor = persistStore(store);

export const Web3authProvider: React.FC<Web3authProviderProps> = ({
  children,
}) => {
  const [web3auth, setWeb3auth] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <Web3authContext.Provider
          value={{ web3auth, setWeb3auth, provider, setProvider }}
        >
          {children}
        </Web3authContext.Provider>
      {/* </PersistGate> */}
    </Provider>
  );
};
