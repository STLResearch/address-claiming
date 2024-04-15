
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, OPENLOGIN_NETWORK } from "@web3auth/base";
import   swal  from "sweetalert";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
import { VersionedTransaction } from "@solana/web3.js";
import { useAuth } from "@/hooks/useAuth";
export const BidModal = ({ data, onClose, onSubmit,user1,solanaWallet }:{data:any,onClose:any,onSubmit?:any,user1:any,solanaWallet:any}) => {
    const [bid, setBid] = useState('');
    const [amount, setAmount] = useState('0');
       //@ts-ignore
  const { user: selectorUser } = useAuth();

  const router = useRouter();


    const handleSubmit = async () => {
      const signatureObj:{
        sign?:any;
        sign_nonce?:any ;
        sign_issue_at?:any ;
        sign_address?:any
      } = {};
      if(user1){
        let ownerAddress = await solanaWallet.requestAccounts();
     
        console.log(ownerAddress[0]);
        let reqBody = {
          assetId: data.assetId,
          bidder: ownerAddress[0],
          bidOffer: amount,
          bidType: 'Auction',
        };
        try {
          const domain = window.location.host;
              const origin = window.location.origin;
  
              const payload = new SIWPayload();
              payload.domain = domain;
              payload.uri = origin;
              payload.address = user1.blockchainAddress ;
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
    
                  uri: `/nft/bid`,
                  sign: signatureObj.sign,
                  time: signatureObj.sign_issue_at,
                  nonce: signatureObj.sign_nonce,
                  address: signatureObj.sign_address,
                },
                body: JSON.stringify(reqBody),
              });
              let ans1 = await ans.json();
              console.log('ans',ans)
  
          //let ans = await axios.post('/api/placeBid', { body: { reqBody } });
          //console.log(ans);
          
            let resTx = ans1?.tx;
            console.log('tx', resTx);
            let bfferedTx = Buffer.from(resTx, 'base64');
            let uintArrTx = new Uint8Array(bfferedTx);
            let Vtx = VersionedTransaction.deserialize(uintArrTx);
            let sig = await solanaWallet.signTransaction(Vtx);
            console.log('raw sig', sig);
            let serializedSig = sig.serialize();
            let bufferedSeriSx = Buffer.from(serializedSig);
            let finalTx = bufferedSeriSx.toString('base64');
            console.log('final sig', finalTx);
            let reqBody2 = {
              sig: finalTx,
              assetId: data.assetId,
            };
  
            let ans2 = await fetch(`/api/proxy?${Date.now()}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
  
                uri: `/nft/tx/submit`,
                sign: signatureObj.sign,
                time: signatureObj.sign_issue_at,
                nonce: signatureObj.sign_nonce,
                address: signatureObj.sign_address,
              },
              body: JSON.stringify(reqBody2),
            });
            ans2 = await ans2.json();
            console.log('ans2',ans2)
  
            //let res = await axios.post('/api/placeBid/submitBid', { body: reqBody2 });
            //console.log('res2=', res);
            /*  const signatureBuffer = Buffer.from(finalTx, 'base64');
            const txHash = signatureBuffer.toString('hex');
            console.log('sig hash', txHash); */
          
        } catch (error) {
          console.log(error);
        }
      }else{
        console.log('no user1')
      }
      
    }; // State to store the input value
  
    const handleChange = (event) => {
      const value = event.target.value;
      // Validate input to accept only positive numbers
      if (/^\d*\.?\d*$/.test(value)) {
        setAmount(value === '' ? '' : parseFloat(value).toString());
      }
    };

  
    return (
      <div className="fixed inset-0 flex justify-center items-center z-30 bg-gray-900 bg-opacity-50 animate__animated animate__zoomInDown">
        <div className="bg-white px-8 pt-4 pb-8 rounded-[20px] w-full max-w-[36rem] relative flex flex-col gap-4">
          <div onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
            <button className="w-6 h-6" >xx</button>
          </div>
          <div className="text-center font-semibold text-lg">{data.name}</div>
          <div className="flex w-full items-center justify-between mb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div>Owner:</div>
                <div className="text-grayText text-sm w-36 overflow-hidden">{data.owner}</div>
              </div>
              <div className="flex items-center gap-2">
                <div>Asset ID:</div>
                <div className="text-grayText text-sm w-36 overflow-hidden">{data.assetId}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div>Highest Bid</div>
              <div className="font-semibold text-xl">${data.highestBid}</div>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="bid">Your Bid</label>
            <div className="w-full flex px-4 border-gray-300 rounded-[10px] border ">
              <div className="py-2 pr-2 text-grayText">$</div>
              <input
                type="text"
                id="bid"
                className="rounded-[10px] py-2 focus:outline-none"
                value={amount}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <Button type="secondary" label="Cancel" onClick={onClose} />
            <Button label="Submit" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    );
  };