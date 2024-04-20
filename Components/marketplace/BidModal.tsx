import { useState } from "react";
import { Button } from "./Button";

import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
import { VersionedTransaction } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";

export const BidModal = ({
  data,
  onClose,
  user,
  solanaWallet
}: {
  data: {
    assetId: string;
    owner: string;
    highestBid: string;
    totalBids: string;
  };
  onClose: React.MouseEventHandler<HTMLDivElement>;
  onSubmit?: any;
  user: any;
  solanaWallet: SolanaWallet;
}) => {
  const [amount, setAmount] = useState<string>("0");
  const handleSubmit = async () => {
    const signatureObj: {
      sign?: string;
      sign_nonce?: string;
      sign_issue_at?: string;
      sign_address?: string;
    } = {};
    if (user) {
      const ownerAddress = await solanaWallet.requestAccounts();

      const reqBody = {
        assetId: data.assetId,
        bidder: ownerAddress[0],
        bidOffer: amount,
        bidType: "Auction"
      };
      try {
        const domain = window.location.host;
        const origin = window.location.origin;

        const payload = new SIWPayload();
        payload.domain = domain;
        payload.uri = origin;
        payload.address = user.blockchainAddress;
        payload.statement = "Sign in to SkyTrade app.";
        payload.version = "1";
        payload.chainId = 1;

        const header = { t: "sip99" };
        const network = "solana";

        const message = new SIWWeb3({ header, payload, network });

        const messageText = message.prepareMessage();
        const msg = new TextEncoder().encode(messageText);
        const result = await solanaWallet.signMessage(msg);

        const signature = base58.encode(result);

        signatureObj.sign = signature;
        signatureObj.sign_nonce = message.payload.nonce;
        signatureObj.sign_issue_at = message.payload.issuedAt;
        signatureObj.sign_address = user.blockchainAddress;

        const addBid = await fetch(`/api/proxy?${Date.now()}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            uri: `/nft/bid`,
            sign: signatureObj.sign,
            time: signatureObj.sign_issue_at,
            nonce: signatureObj.sign_nonce,
            address: signatureObj.sign_address
          },
          body: JSON.stringify(reqBody)
        });
        const addBidJson = await addBid.json();

        const resTx = addBidJson?.tx;

        const bfferedTx = Buffer.from(resTx, "base64");
        const uintArrTx = new Uint8Array(bfferedTx);
        const Vtx = VersionedTransaction.deserialize(uintArrTx);
        const sig = await solanaWallet.signTransaction(Vtx);

        const serializedSig = sig.serialize();
        const bufferedSeriSx = Buffer.from(serializedSig);
        const finalTx = bufferedSeriSx.toString("base64");

        const reqBody2 = {
          sig: finalTx,
          assetId: data.assetId
        };

        let submitTx = await fetch(`/api/proxy?${Date.now()}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            uri: `/nft/tx/submit`,
            sign: signatureObj.sign,
            time: signatureObj.sign_issue_at,
            nonce: signatureObj.sign_nonce,
            address: signatureObj.sign_address
          },
          body: JSON.stringify(reqBody2)
        });
        submitTx = await submitTx.json();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("no user");
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value === "" ? "" : parseFloat(value).toString());
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-30 bg-gray-900 bg-opacity-50 animate__animated animate__zoomInDown">
      <div className="bg-white px-8 pt-4 pb-8 rounded-[20px] w-full max-w-[36rem] relative flex flex-col gap-4">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 cursor-pointer"
        >
          <button className="w-6 h-6">xx</button>
        </div>
        {/*           <div className="text-center font-semibold text-lg">{data.name}</div> */}
        <div className="flex w-full items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div>Owner:</div>
              <div className="text-grayText text-sm w-36 overflow-hidden">
                {data.owner}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>Asset ID:</div>
              <div className="text-grayText text-sm w-36 overflow-hidden">
                {data.assetId}
              </div>
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
          <Button label="Cancel" onClick={onClose} />
          <Button label="Submit" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
