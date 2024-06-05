import { toast } from "react-toastify";
import { SolanaWallet } from "@web3auth/solana-provider";
import { IProvider } from "@web3auth/base";
import { VersionedTransaction } from "@solana/web3.js";
export const executeTransaction = async (transaction: VersionedTransaction, provider: IProvider) => {
  if (!provider) {
    toast.error("Session cleared, login again");
    return null;
  }

  const solanaWallet = new SolanaWallet(provider);
  const signedTx = await solanaWallet.signTransaction(transaction);
  const serializedTx = signedTx.serialize();
  return Buffer.from(serializedTx).toString("base64");
};
