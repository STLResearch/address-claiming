import { ConnectionConfig, User } from "@/types";
import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import axios from "axios";

export const fetchBalance = async (user: User | null) => {
  if (!user) return 0;
  const response = await axios.post(
    String(process.env.NEXT_PUBLIC_RPC_TARGET),
    {
      jsonrpc: "2.0",
      id: 1,
      method: "getTokenAccountsByOwner",
      params: [
        user.blockchainAddress,
        {
          mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
        },
        {
          encoding: "jsonParsed",
        },
      ],
    },
  );
  const { value } = response.data.result;
  if (value.length < 1) return 0;

  return value[0].account.data.parsed.info.tokenAmount.uiAmountString;
};

export const fetchsolbalance = async (provider: any) => {
  const solanaWallet = new SolanaWallet(provider);
  const accounts = await solanaWallet.requestAccounts();
  const connectionConfig: ConnectionConfig = await solanaWallet.request({
    method: "solana_provider_config",
    params: [],
  });

  const connection = new Connection(connectionConfig.rpcTarget);
  const solbalance1 = await connection.getBalance(new PublicKey(accounts[0]));
  return solbalance1;
};
