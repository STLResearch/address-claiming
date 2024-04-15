
import   swal  from "sweetalert";
import { Web3Auth } from "@web3auth/modal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CHAIN_NAMESPACES, OPENLOGIN_NETWORK } from "@web3auth/base";
import { SolanaWallet } from "@web3auth/solana-provider";
;
import Image from 'next/image'
import map from '../../public/map.png'

import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
import {
  
    VersionedTransaction,
  } from "@solana/web3.js";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "./Button";
import React from 'react'
import { useAuth } from "@/hooks/useAuth";




 export  const AssetCard = ({
    assetId,
    owner,
    setIsLoading,
    user1,
    solanaWallet
  }:{assetId:any,owner:any,setIsLoading:any,user1:any,solanaWallet:any}) => {
   
  
    //@ts-ignore

   

let router=useRouter()
    const sucess = () => toast.success('nft added to auction', {});
    const error1 = () => toast.error('plzz try again');
    const handleOnClick = async () => {

      setIsLoading(true);
      const signatureObj:{
        sign?:any;
        sign_nonce?:any ;
        sign_issue_at?:any ;
        sign_address?:any
      } = {};
      let date1 = new Date().setHours(new Date().getHours() + 4);
      let endDate = new Date(date1).toISOString();
      console.log(endDate);
  
      let reqBody = {
        assetId: assetId,
        listingType: 'Auction',
        isActive: true,
        owner: owner,
        listingPrice: 0,
        endDate: endDate,
      };
      if(user1){
         try {
        const domain = window.location.host;
            const origin = window.location.origin;

            const payload = new SIWPayload();
            payload.domain = domain;
            payload.uri = origin;
            payload.address = user1.blockchainAddress;
            payload.statement = "Sign in to SkyTrade app.";
            payload.version = "1";
            payload.chainId = 1;

            const header = { t: "sip99" };
            const network = "solana";

            let message = new SIWWeb3({ header, payload, network });

            const messageText = message.prepareMessage();
            const msg = new TextEncoder().encode(messageText);
            const result = await solanaWallet.signMessage(msg);

            const signature = base58.encode(result);

            signatureObj.sign = signature;
            signatureObj.sign_nonce = message.payload.nonce;
            signatureObj.sign_issue_at = message.payload.issuedAt;
            signatureObj.sign_address = user1.blockchainAddress;


            let ans = await fetch(`/api/proxy?${Date.now()}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
  
                uri: `/nft`,
                sign: signatureObj.sign,
                time: signatureObj.sign_issue_at,
                nonce: signatureObj.sign_nonce,
                address: signatureObj.sign_address,
              },
              body: JSON.stringify(reqBody),
            });
           let  ans1 = await ans.json();
            console.log('ans',ans)
        //let ans = await axios.post('/api/postCnftAuction', { body: reqBody });
        setIsLoading(false);
        console.log(ans1.tx)
        let txs = ans1.tx;
        let bfferedTx1 = Buffer.from(txs[0], 'base64');
        let uintArrTx1 = new Uint8Array(bfferedTx1);
        let Vtx1 = VersionedTransaction.deserialize(uintArrTx1);
        let bfferedTx2 = Buffer.from(txs[1], 'base64');
        let uintArrTx2 = new Uint8Array(bfferedTx2);
        let Vtx2 = VersionedTransaction.deserialize(uintArrTx2);
        let sig = await solanaWallet.signAllTransactions([Vtx1, Vtx2]);
        console.log('raw sig', sig);
        let serializedSig1 = sig[0].serialize();
        let bufferedSeriSx1 = Buffer.from(serializedSig1);
        let finalTx1 = bufferedSeriSx1.toString('base64');
        console.log('final sig', finalTx1);
        let serializedSig2 = sig[1].serialize();
        let bufferedSeriSx2 = Buffer.from(serializedSig2);
        let finalTx2 = bufferedSeriSx2.toString('base64');
        console.log('final sig', finalTx2);
  
        let reqBody2 = {
          sig: [finalTx1, finalTx2],
          assetId: assetId
        };
        console.log('allsig',reqBody2)
        let ans2 = await fetch(`/api/proxy?${Date.now()}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            uri: `/nft/txs/submit`,
            sign: signatureObj.sign,
            time: signatureObj.sign_issue_at,
            nonce: signatureObj.sign_nonce,
            address: signatureObj.sign_address,
          },
          body: JSON.stringify(reqBody2),
        });
        ans2 = await ans2.json();
        console.log('ans2',ans2)

        //let res2 = await axios.post('/api/sellApi', { body: reqBody2 });
        //console.log('res2=', res);
        if (ans1.data.status == 500) {
          throw new Error(ans1.data.text);
        }
        
        sucess();
      } catch (error) {
        console.log('error', error);
        error1();
      }
    }else{
      console.log('no user1')
    }

  
      console.log('click');
    };

    return (
      <>
        <div className="flex flex-col m-1 rounded-[10px] shadow-md h-[410px] w-[290px] hover:bg-gray-100 transition ease-in-out duration-300">
          <div className="h-[50%]">
            
             <Image src={map} width={290} height={174} alt="map" /> 
          </div>
          <div className="flex flex-col px-4 gap-4">
            <div className="font-semibold">Asset</div>
            <div className="flex justify-between w-full text-sm">
              <div className="flex flex-col">
                <div className="text-grayText">Asset ID</div>
                <div className="text-sm w-4/6 overflow-hidden">{assetId}</div>
              </div>
            </div>
  
            <div className="flex justify-between w-full text-sm">
              <div className="flex flex-col">
                <div className="text-grayText">Owner</div>
                <div className="text-sm w-4/6 overflow-hidden">{owner}</div>
              </div>
            </div>
            <div>
              <Button onClick={handleOnClick} label="put asset to Auction" />
            </div>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </>
    );
  };