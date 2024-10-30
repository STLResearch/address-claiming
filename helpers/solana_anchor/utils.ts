import 'dotenv/config';
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, Transaction } from '@solana/web3.js';
import { hexlify } from 'ethers';

import { base64, bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

import { MessageTransmitter,IDL as idl1 } from './idl_rm';
import { TokenMessengerMinter } from './idl_mt'
import { connection, MessageTransmitterprogram, TokenMessengerMinterprogram } from './setup';

import { IProvider } from '@web3auth/base';
import { SolanaWallet } from '@web3auth/solana-provider';


export const IRIS_API_URL = process.env.IRIS_API_URL ?? "https://iris-api-sandbox.circle.com";
export const SOLANA_SRC_DOMAIN_ID = 5;
//export const SOLANA_USDC_ADDRESS = process.env.SOLANA_USDC_ADDRESS ?? "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export interface FindProgramAddressResponse {
  publicKey: anchor.web3.PublicKey;
  bump: number;
}

// Configure client to use the provider and return it.
// Must set ANCHOR_WALLET (solana keypair path) and ANCHOR_PROVIDER_URL (node URL) env vars


export const getPrograms = () => {
  // Initialize contracts
  const messageTransmitterProgram = MessageTransmitterprogram
  const tokenMessengerMinterProgram = TokenMessengerMinterprogram
  return { messageTransmitterProgram, tokenMessengerMinterProgram };
}



export const getReceiveMessagePdas = async (
    {messageTransmitterProgram, tokenMessengerMinterProgram}: ReturnType<typeof getPrograms>,
    solUsdcAddress: PublicKey,
    remoteUsdcAddressHex: string,
    remoteDomain: string,
    nonce: string,
    provider:IProvider,feePayerAddress:string
) => {
    const tokenMessengerAccount = findProgramAddress("token_messenger", tokenMessengerMinterProgram.programId);
    const messageTransmitterAccount = findProgramAddress("message_transmitter", messageTransmitterProgram.programId);
    const tokenMinterAccount = findProgramAddress("token_minter", tokenMessengerMinterProgram.programId);
    const localToken = findProgramAddress("local_token", tokenMessengerMinterProgram.programId, [solUsdcAddress]);
    const remoteTokenMessengerKey = findProgramAddress("remote_token_messenger", tokenMessengerMinterProgram.programId, [remoteDomain]);
    const remoteTokenKey = new PublicKey(hexToBytes(remoteUsdcAddressHex));
    const tokenPair = findProgramAddress("token_pair", tokenMessengerMinterProgram.programId, [
        remoteDomain,
        remoteTokenKey,
    ]);
    const custodyTokenAccount = findProgramAddress("custody", tokenMessengerMinterProgram.programId, [
        solUsdcAddress,
    ]);
    const authorityPda = findProgramAddress(
        "message_transmitter_authority",
        messageTransmitterProgram.programId,
        [tokenMessengerMinterProgram.programId]
    ).publicKey;
    const tokenMessengerEventAuthority = findProgramAddress("__event_authority", tokenMessengerMinterProgram.programId);

    const usedNoncesix = await messageTransmitterProgram.methods
    .getNoncePda({
      nonce: new anchor.BN(nonce), 
      sourceDomain: Number(remoteDomain)
    })
    .accounts({
      messageTransmitter: messageTransmitterAccount.publicKey
    })
    .instruction();

    let tx=new Transaction().add(usedNoncesix)
    
    
   // let parsedSig=await connection.simulateTransaction(tx,[keypair]).catch(e=>console.log("error simulate tx",e))
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        
        const solanaWallet = new SolanaWallet(provider);
        tx.feePayer=new PublicKey(feePayerAddress)
        const signedTx = await solanaWallet.signTransaction(tx);
  
  const serializedTx = signedTx.serialize();
        let sig=await sendAndConfirmRawTransaction(connection,serializedTx).catch(e=>console.log("error nonce tx",e))
    
    
    
    let txsigNonce=sig
    let txdetail=await connection.getParsedTransaction(txsigNonce as string)
    console.log('nonce message',txdetail?.meta?.logMessages) 
    let nonceLogsize=txdetail?.meta?.logMessages?.length as number
    let uno=txdetail?.meta?.logMessages?txdetail?.meta?.logMessages[nonceLogsize-2]:null;
    //console.log('actual nonce',parsedSig?.value.returnData?.data[0],"revnonce",uno?.split(' ').pop())
    let usedNonces=new PublicKey(Uint8Array.from(base64.decode(uno?.split(' ').pop() as string)))
    console.log({usedNonces:usedNonces.toString()})
    return {
        messageTransmitterAccount,
        tokenMessengerAccount,
        tokenMinterAccount,
        localToken,
        remoteTokenMessengerKey,
        remoteTokenKey,
        tokenPair,
        custodyTokenAccount,
        authorityPda,
        tokenMessengerEventAuthority,
        usedNonces
    }
}

export const solanaAddressToHex = (solanaAddress: string): string =>
  hexlify(bs58.decode(solanaAddress));

export const evmAddressToSolana = (evmAddress: string): string =>
  bs58.encode(hexToBytes(evmAddress));

export const evmAddressToBytes32 = (address: string): string => `0x000000000000000000000000${address.replace("0x", "")}`;

export const hexToBytes = (hex: string): Buffer => Buffer.from(hex.replace("0x", ""), "hex");

// Convenience wrapper for PublicKey.findProgramAddressSync
export const findProgramAddress = (
  label: string,
  programId: PublicKey,
  extraSeeds: (string | number[] | Buffer | PublicKey)[] |null = null
): FindProgramAddressResponse => {
  const seeds = [Buffer.from(anchor.utils.bytes.utf8.encode(label))];
  if (extraSeeds) {
    for (const extraSeed of extraSeeds) {
      if (typeof extraSeed === "string") {
        seeds.push(Buffer.from(anchor.utils.bytes.utf8.encode(extraSeed)));
      } else if (Array.isArray(extraSeed)) {
        seeds.push(Buffer.from(extraSeed as number[]));
      } else if (Buffer.isBuffer(extraSeed)) {
        seeds.push(extraSeed);
      } else {
        seeds.push(extraSeed.toBuffer());
      }
    }
  }
  const res = PublicKey.findProgramAddressSync(seeds, programId);
  return { publicKey: res[0], bump: res[1] };
};

// Fetches attestation from attestation service given the txHash
export const getMessages = async (txHash: string) => {
    console.log("Fetching messages for tx...", txHash);
    let attestationResponse: any = {};
    while(attestationResponse.error || !attestationResponse.messages || attestationResponse.messages?.[0]?.attestation === 'PENDING') {
        const response = await fetch(`${IRIS_API_URL}/messages/${SOLANA_SRC_DOMAIN_ID}/${txHash}`);
        attestationResponse = await response.json();
        // Wait 2 seconds to avoid getting rate limited
        if (attestationResponse.error || !attestationResponse.messages || attestationResponse.messages?.[0]?.attestation === 'PENDING') {
            await new Promise(r => setTimeout(r, 2000))
        }
    }

    return attestationResponse; 
}

export const decodeEventNonceFromMessage = (messageHex: string): string => {
    const nonceIndex = 12;
    const nonceBytesLength = 8;
    const message = hexToBytes(messageHex);
    const eventNonceBytes = message.subarray(nonceIndex, nonceIndex + nonceBytesLength);
    const eventNonceHex = hexlify(eventNonceBytes);
    return BigInt(eventNonceHex).toString();
};