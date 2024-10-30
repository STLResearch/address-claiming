import { useContext, useEffect } from "react";

import { Web3authContext } from "@/providers/web3AuthProvider";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, UX_MODE } from "@web3auth/base";

const useInitAuth = () => {
  const { setWeb3auth, setProvider } = useContext(Web3authContext);

  const init = async () => {
    try {
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
        displayName: process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME,
        blockExplorer: "https://explorer.solana.com",
        ticker: "SOL",
        tickerName: "Solana Token",
      };

      const privateKeyProvider = new SolanaPrivateKeyProvider({
        config: { chainConfig },
      });

      const web3auth = new Web3AuthNoModal({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
        privateKeyProvider,
        chainConfig,
      });

      setWeb3auth(web3auth);

      const openloginAdapter = new OpenloginAdapter({
        privateKeyProvider,
        adapterSettings: {
          uxMode: UX_MODE.REDIRECT,
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.init();
      setProvider(web3auth.provider);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return { init };
};

export default useInitAuth;
