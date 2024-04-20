import { useState } from "react";
import { BidModal } from "./BidModal";
import Image from "next/image";
import { Button } from "./Button";
import { SolanaWallet } from "@web3auth/solana-provider";

export const AuctionCard = ({
  assetId,
  owner,
  highestBid,
  totalBids,
  user,
  solanaWallet
}: {
  assetId: string;
  owner: string;
  highestBid: string;
  totalBids: string;
  user: any;
  solanaWallet: SolanaWallet;
}) => {
  const [toggleBidModal, setToggleBidModal] = useState(false);

  return (
    <>
      {toggleBidModal && (
        <BidModal
          data={{ assetId, owner, highestBid, totalBids }}
          onClose={() => setToggleBidModal(false)}
          user={user}
          solanaWallet={solanaWallet}
        />
      )}
      <div className="flex flex-col rounded-[10px] shadow-md h-[410px] w-[290px] hover:bg-gray-100 transition ease-in-out duration-300">
        <div className="h-[50%]">
          <Image src={"/map.png"} width={290} height={174} alt="map" />
        </div>
        <div className="flex flex-col px-4 gap-4">
          <div className="font-semibold"></div>
          <div className="flex justify-between w-full text-sm">
            <div className="flex flex-col">
              <div className="text-grayText">Asset ID</div>
              <div className="  text-sm w-24 overflow-hidden">{assetId}...</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-grayText">Total Bids</div>
              <div>{totalBids}</div>
            </div>
          </div>

          <div className="flex justify-between w-full text-sm">
            <div className="flex flex-col">
              <div className="text-grayText">Owner</div>
              <div className="  text-sm w-24 overflow-hidden">{owner} </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-grayText">Highest Bid</div>
              <div>${highestBid}</div>
            </div>
          </div>
          <div>
            <Button onClick={() => setToggleBidModal(true)} label="Place Bid" />
          </div>
        </div>
      </div>
    </>
  );
};
