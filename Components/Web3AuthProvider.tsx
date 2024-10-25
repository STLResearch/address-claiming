"use client"
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet,sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { injected } from "wagmi/connectors";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],

    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/Pfjofe7M4pb82Po5XfF0KHUEp5g_Kv6z`,
      ),
    },
    connectors: [injected()],

    // Required API Keys
    walletConnectProjectId: "eca919b068b66b9b66591ef783be6c76",

    // Required App Info
    appName: "Your App Name",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};