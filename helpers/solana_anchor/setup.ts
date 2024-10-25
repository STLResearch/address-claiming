import { Program } from "@coral-xyz/anchor";
import { IDL as idlRm, MessageTransmitter } from "./idl_rm";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TokenMessengerMinter,IDL as idlMt } from './idl_mt'
const programId = new PublicKey("CCTPmbSD7gX1bxKPAmg77w8oFzNFpaQiQUWD43TKaecd"); //MessageTransmitter
export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const MessageTransmitterprogram = new Program<MessageTransmitter>(idlRm, programId, {
  connection,
});



const programId2 = new PublicKey("CCTPiPYPc6AsJuwueEnWgSgucamXDZwBd53dQ11YiKX3"); 
export const TokenMessengerMinterprogram = new Program<TokenMessengerMinter>(idlMt, programId2, {
  connection,
});



