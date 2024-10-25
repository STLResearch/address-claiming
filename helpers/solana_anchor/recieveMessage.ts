import 'dotenv/config';
import { PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import {  decodeEventNonceFromMessage,  getPrograms, getReceiveMessagePdas } from './utils';
import { REMOTE_DOMAIN, REMOTE_TOKEN_HEX, USDC_ADDRESS, } from './sol_const';

import { connection } from './setup';
import { IProvider } from '@web3auth/base';
import { SolanaWallet } from '@web3auth/solana-provider';

export const recieveSol = async (messageBytes:string, attestationSignature:string,provider:IProvider,feePayerAddress:string,userata:PublicKey) => {
    

    const { messageTransmitterProgram, tokenMessengerMinterProgram } = getPrograms();

    // Init needed variables
    const usdcAddress = new PublicKey(USDC_ADDRESS);
    const userTokenAccount = new PublicKey(userata)
    const remoteTokenAddressHex = REMOTE_TOKEN_HEX!;
    const remoteDomain = REMOTE_DOMAIN!;
    const messageHex = messageBytes!;
    const attestationHex = attestationSignature!;
    const nonce = decodeEventNonceFromMessage(messageHex);

    // Get PDAs
    const pdas = await getReceiveMessagePdas(
        {messageTransmitterProgram, tokenMessengerMinterProgram},
        usdcAddress,
        remoteTokenAddressHex,
        remoteDomain,
        nonce,
        provider,
        feePayerAddress
    )

    // accountMetas list to pass to remainingAccounts
    const accountMetas: any[] = [];
    accountMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: pdas.tokenMessengerAccount.publicKey,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: pdas.remoteTokenMessengerKey.publicKey,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: true,
        pubkey: pdas.tokenMinterAccount.publicKey,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: true,
        pubkey: pdas.localToken.publicKey,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: pdas.tokenPair.publicKey,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: true,
        pubkey: userTokenAccount,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: true,
        pubkey: pdas.custodyTokenAccount.publicKey,
    });
    accountMetas.push({
        isSigner: false,
        isWritable: false,
        pubkey: spl.TOKEN_PROGRAM_ID,
    });
    accountMetas.push({
      isSigner: false,
      isWritable: false,
      pubkey: pdas.tokenMessengerEventAuthority.publicKey,
    });
    accountMetas.push({
      isSigner: false,
      isWritable: false,
      pubkey: tokenMessengerMinterProgram.programId,
    });

     const receiveMessageix = await messageTransmitterProgram.methods
        .receiveMessage({
            message: Buffer.from(messageHex.replace("0x", ""), "hex"),
            attestation: Buffer.from(attestationHex.replace("0x", ""), "hex"),
        })
        .accounts({
            payer: new PublicKey(feePayerAddress),
            caller: new PublicKey(feePayerAddress),
            authorityPda: pdas.authorityPda,
            messageTransmitter: pdas.messageTransmitterAccount.publicKey,
            usedNonces: pdas.usedNonces,
            receiver: tokenMessengerMinterProgram.programId,
            systemProgram: SystemProgram.programId,
        })
        .remainingAccounts(accountMetas)
        .instruction(); 
        
        const receiveMessageTx=new Transaction()
        
        try {
            await spl.getAccount(connection,userata );
          } catch (error) {
            if (error.name == "TokenAccountNotFoundError") {
              let createIx = spl.createAssociatedTokenAccountInstruction(
                new PublicKey(feePayerAddress),
                userata,
                new PublicKey(feePayerAddress),
                new PublicKey(USDC_ADDRESS)
              );
    
             
    
              receiveMessageTx.add(createIx);
            }
          }
          receiveMessageTx.add(receiveMessageix)
        receiveMessageTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        
        const solanaWallet = new SolanaWallet(provider);
        receiveMessageTx.feePayer=new PublicKey(feePayerAddress)
        const signedTx = await solanaWallet.signTransaction(receiveMessageTx);
  
  const serializedTx = signedTx.serialize();
        let sig=await sendAndConfirmRawTransaction(connection,serializedTx).catch(e=>console.log("error send tx",e))
    
    console.log("\n\nreceiveMessage Tx: ", sig);
    return sig
}

/* recieveSol(); */