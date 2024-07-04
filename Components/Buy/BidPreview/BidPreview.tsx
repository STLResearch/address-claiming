import React, { useContext, useState } from "react";
import {
  RectangleIcon,
  LocationPointIcon,
  CloseIcon,
} from "@/Components/Icons";
import Image from "next/image";
import Image1 from "@/public/images/AHImage.png";
import { useMobile } from "@/hooks/useMobile";
import MarketPlaceService from "@/services/MarketPlaceService";
import useAuth from "@/hooks/useAuth";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import { VersionedTransaction } from "@solana/web3.js";
import { executeTransaction } from "@/utils/rent/transactionExecutor";
import { Web3authContext } from "@/providers/web3authProvider";
import { AuctionDataI } from "@/types";

interface BidPreviewProps {
  setShowSuccessAndErrorPopup: React.Dispatch<React.SetStateAction<boolean>>;
  auctionDetailData: AuctionDataI | undefined;
  currentUserBid: number | null;
  onClose: ()=>void;
  setBidResponseStatus: React.Dispatch<React.SetStateAction<"SUCCESS" | "FAIL">>;
}
const BidPreview: React.FC<BidPreviewProps> = ({
  auctionDetailData,
  setBidResponseStatus,
  currentUserBid,
  onClose,
  setShowSuccessAndErrorPopup,
}) => {
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const { provider } = useContext(Web3authContext);
  const [isLoading, setIsLoading] = useState(false);
  const { createBid, submitSignature } = MarketPlaceService();

  const handleBid = async () => {
    try {
      setIsLoading(true);
      const postData = {
        assetId: auctionDetailData?.assetId,
        callerBlockchainAddress: user?.blockchainAddress,
        bidOffer: currentUserBid,
        bidType: "Auction",
      };
      const response = await createBid({ postData });
      if (response && response?.data && response?.data?.tx) {
        const transaction = VersionedTransaction.deserialize(
          new Uint8Array(Buffer.from(response?.data?.tx, "base64"))
        );
        const signature = await executeTransaction(transaction, provider);
        if (signature) {
          const postData = {
            signature: signature,
            assetId: auctionDetailData?.assetId,
          };
          const result = await submitSignature({ postData });
          if(result == undefined || result?.data?.message == 'failed to submit transaction'){
            setBidResponseStatus("FAIL");
        setShowSuccessAndErrorPopup(true);
          }
          else if(result?.data?.message == 'Transaction submitted'){
            setBidResponseStatus("SUCCESS");
        setShowSuccessAndErrorPopup(true);
          }
        }
      } else {
        setBidResponseStatus("FAIL");
        setShowSuccessAndErrorPopup(true);
      }

    } catch (error) {
      console.error("error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed bottom-0  sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white rounded-t-[30px] md:rounded-[30px] w-full h-[490px] md:h-[471px] overflow-y-auto overflow-x-auto md:w-[689px] z-[500] sm:z-50 flex flex-col gap-[15px] ">
      <div className="px-[25px] ">
        <div className=" flex flex-col justify-end items-center mt-4 md:mt-0 ">
          {isMobile && (
            <div
              onClick={onClose}
              className=" flex flex-col justify-end items-center mt-4 md:mt-0 "
            >
              <div className=" w-[90%] flex justify-center  items-center">
                <RectangleIcon />
              </div>
            </div>
          )}
          <div className="flex w-full items-center mt-[21px]">
            <div className="flex w-full justify-center">
              <h2 className="text-[#222222] font-medium text-xl text-center ">
                Bid Preview
              </h2>
            </div>
            {!isMobile && (
              <button
                onClick={onClose}
                className="flex items-center  justify-end w-[15px] h-[15px] cursor-pointer"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>
        <div
          className="touch-manipulation flex items-center gap-[10px] py-4 px-[22px] mt-[15px] rounded-lg"
          style={{ border: "1px solid #4285F4" }}
        >
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {auctionDetailData?.properties[0]?.address}
          </p>
        </div>
        <div className="flex flex-col gap-y-[15px] mt-[15px] text-[14px] text-light-black leading-[21px]">
          <div className="relative h-[130px]">
            <Image
              src={
                auctionDetailData?.metadata?.data?.uri
                  ? auctionDetailData?.metadata?.data?.uri
                  : Image1
              }
              alt="airspace image"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-y-[15px] mt-[15px] truncate text-[14px] text-light-black leading-[21px]">
            <div className="flex">
              <div>Owner:</div>
              <div className="text-light-grey pl-[15px] truncate ">
                {auctionDetailData?.owner}
              </div>
            </div>
            <div className="flex">
              <div>ID::</div>
              <div className="text-light-grey pl-[15px]">
                {auctionDetailData?.id}
              </div>
            </div>
            <div className="flex">
              <div>Fees:</div>
              <div className="text-light-grey pl-[15px]">
                {auctionDetailData?.price}
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className="flex items-end">
              <div className="text-light-black ">
                <div className="text-[14px] leading-[21px] ">Your Bid</div>
                <div className="font-bold text-2xl leading-9">
                  &#36; {currentUserBid}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`px-[29px] py-[10px] ${isMobile ? "shadow-[0_0px_4.2px_0px_rgba(0,0,0,0.25)]" : "shadow-none"} touch-manipulation flex items-center justify-between gap-[20px] text-[14px]`}
      >
        <div className="w-1/2 ">
          {isMobile ? (
            <div>
              <div className="text-light-black ">
                <div className="text-[14px] leading-[21px] ">Your Bid</div>
                <div className="font-bold text-2xl leading-9">
                  &#36; {currentUserBid}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={onClose}
              className="touch-manipulation rounded-[5px] w-full text-center py-[10px] border border-[#0653EA] text-[#0653EA] cursor-pointer"
            >
              Cancel
            </div>
          )}
        </div>

        <LoadingButton
          isLoading={false}
          onClick={handleBid}
          className="touch-manipulation rounded-[5px]  text-white bg-[#0653EA] cursor-pointer w-1/2 flex justify-center px-[17px] py-[10px]"
        >
          <button onClick={() => handleBid()}>Confirm Bid</button>
        </LoadingButton>
      </div>
    </div>
  );
};

export default BidPreview;
