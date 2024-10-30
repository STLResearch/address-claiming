"use client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, sepolia, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { injected } from "wagmi/connectors";
import { metadata } from "@/app/layout";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],

    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(process.env.NEXT_PUBLIC_ETH_TESTNET_RPC),
    },
    connectors: [injected()],

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_ETH_WALLETCONNECTPROJECTID as string,

    // Required App Info
    appName: "Sky Trade",

    // Optional App Info
    appDescription: "The Ultimate Air Right Hub",
    appUrl: "https://sky.trade", // your app's url
    appIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdCEKx1asjzXgyTsBb7mKtDgnktfvqyDHccw&s", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
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
