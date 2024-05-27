"use client";
import store from "@/store/store";
import React, { createContext, useState } from "react";
import { Provider } from "react-redux";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { IProvider } from "@web3auth/base";
import { Sidebar } from "./sidebar";
import { ToastContainer } from "react-toastify";
import CookieConsent from "@/Components/CookieConsent";


export interface Web3authContextI {
  web3auth: Web3AuthNoModal | null;
  setWeb3auth: React.Dispatch<React.SetStateAction<Web3AuthNoModal | null>>;
  provider: IProvider | null;
  setProvider: React.Dispatch<React.SetStateAction<IProvider | null>>;
}

export const Web3authContext = createContext<Web3authContextI>(
  {
    web3auth: null,
    setWeb3auth: () => {},
    provider: null,
    setProvider: () => {},
  }
);

export const Web3auth = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);

  return (
    <Provider store={store}>
      <Web3authContext.Provider
        value={{ web3auth, setWeb3auth, provider, setProvider }}
      >
        <Sidebar>
          <ToastContainer style={{ width: "500px" }} />
          <div id='backdrop-root'></div>
          <div id='modal-root'></div>

          {children}
          <CookieConsent />
        </Sidebar>
      </Web3authContext.Provider>
    </Provider>
  );
};
