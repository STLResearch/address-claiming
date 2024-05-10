import React, { createContext, useState } from 'react';

export const Web3authContext = createContext();

export const Web3authProvider = ({ children }) => {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);

  return (
    <Web3authContext.Provider value={{ web3auth, setWeb3auth, provider, setProvider }}>
      {children}
    </Web3authContext.Provider>
  );
};
