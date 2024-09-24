import {
  Connection,
  NonceAccount,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { resolve } from "path";

export const createNonceIx = async (
  connection: Connection,
  nonceAccountPubkey: PublicKey,
): Promise<NonceAccount> => {
  let nonceAccountInfo;
  let c = 0;

  while (nonceAccountInfo?.data === undefined) {
    c++;
    if (c >= 10) {
      break;
    }
    nonceAccountInfo = await connection.getAccountInfo(nonceAccountPubkey);
    //Sleep for 2s

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const nonceAccount = NonceAccount.fromAccountData(nonceAccountInfo.data);

  return nonceAccount;
};
