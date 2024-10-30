/* eslint-disable complexity */
import React, { useContext, useState } from "react";
import { LocationPointIcon, CloseIcon } from "@/Components/Icons";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import useAuth from "@/hooks/useAuth";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import { LAMPORTS_PER_SOL, VersionedTransaction } from "@solana/web3.js";
import { executeTransaction } from "@/utils/rent/transactionExecutor";
import { Web3authContext } from "@/providers/web3Provider";
import { AuctionDataI } from "@/types";
import MarketplaceService from "@/services/MarketplaceService";
import { getMapboxStaticImage } from "@/utils/marketPlaceUtils";
import { setIsTriggerRefresh } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import useAuction from "@/hooks/useAuction";
import Carousel from "@/Components/Shared/Carousel";
import { formatDate } from "@/utils";
import { fetchsolbalance } from "@/utils/fetchBalance";

interface BidPreviewProps {
  setTxHash: React.Dispatch<React.SetStateAction<string>>;
  setShowSuccessAndErrorPopup: React.Dispatch<React.SetStateAction<boolean>>;
  auctionDetailData: AuctionDataI | undefined;
  currentUserBid: number | null;
  setCurrentUserBid: (number: number | null) => void;
  onClose: () => void;
  setBidResponseStatus: React.Dispatch<React.SetStateAction<"SUCCESS" | "FAIL">>;
}
const BidPreview: React.FC<BidPreviewProps> = ({
  setTxHash,
  auctionDetailData,
  setBidResponseStatus,
  currentUserBid,
  setCurrentUserBid,
  onClose,
  setShowSuccessAndErrorPopup,
}) => {
  const { userSolBalance } = useAppSelector((state) => {
    const { userSolBalance } = state.userReducer;
    return {
      userSolBalance,
    };
  });

  const { userUSDWalletBalance } = useAuction();

  const { isMobile } = useMobile();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { provider } = useContext(Web3authContext);
  const [isLoading, setIsLoading] = useState(false);
  const { getAuctions, createBid, submitSignature } = MarketplaceService();

  const handleBid = async () => {
    if (user?.blockchainAddress === auctionDetailData?.seller) {
      return toast.error("You cannot bid on your own property!");
    }

    const userSolBalance = await fetchsolbalance(provider);

    if (userSolBalance === 0) {
      return toast.info(
        "You don't have sufficient funds to perform this operation, please top up your wallet with some Sol to continue"
      );
    }

    if (parseFloat(userUSDWalletBalance.amount) === 0) {
      return toast.info(
        "You don't have sufficient funds to perform this operation, please top up your wallet with some USD to continue"
      );
    }

    try {
      setIsLoading(true);
      if (
        currentUserBid &&
        auctionDetailData &&
        currentUserBid > auctionDetailData?.initialPrice &&
        currentUserBid <= auctionDetailData?.currentPrice
      ) {
        toast.error("Your bid should be higher than the highest bid");
        setIsLoading(false);
        return;
      } else if (currentUserBid && auctionDetailData && currentUserBid < auctionDetailData?.initialPrice) {
        toast.error("Your bid should be higher or equal to the starting bid");
        setIsLoading(false);
        return;
      }
      const postData = {
        account: user?.blockchainAddress,
      };
      const auction = auctionDetailData?.pdaAddress.toString();
      const response: any = await createBid(postData, auction, currentUserBid);
      if (response && response.tx[0]) {
        const transaction1 = VersionedTransaction.deserialize(new Uint8Array(Buffer.from(response.tx[0], "base64")));

        const tx1 = await executeTransaction(transaction1, provider);

        if (tx1) {
          const postData = {
            serializedTx: tx1,
          };
          const result: any = await submitSignature({ postData });
          if (
            result === undefined ||
            result?.data?.txSignature === "" ||
            result?.data?.txSignature === null ||
            result?.status !== 201
          ) {
            setBidResponseStatus("FAIL");
            setShowSuccessAndErrorPopup(true);
            onClose();
          } else if (result?.data?.txSignature) {
            setTxHash(result?.data?.txSignature);
            setBidResponseStatus("SUCCESS");
            setShowSuccessAndErrorPopup(true);
            dispatch(setIsTriggerRefresh(true));
            await getAuctions();
            onClose();
          }
        }
      } else {
        setBidResponseStatus("FAIL");
        setShowSuccessAndErrorPopup(true);

        onClose();
      }
    } catch (error) {
      console.error("error:", error);
      setBidResponseStatus("FAIL");
      setShowSuccessAndErrorPopup(true);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };
  const { latitude, longitude, title } = auctionDetailData?.layer?.property || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);
  const images = [
    { image_url: "/images/imagetest1.jpg" },
    { image_url: "/images/imagetest2.jpg" },
    { image_url: "/images/imagetest3.jpg" },
  ];
  images[0] = { image_url: imageUrl };

  return (
    <div className="fixed inset-0 bottom-[74px] z-50 flex items-start justify-center bg-[#294B63] bg-opacity-50 pt-32 backdrop-blur-[2px] sm:bottom-0">
      <div className="fixed bottom-0 z-[500] flex h-[540px] w-full flex-col gap-[15px] overflow-x-auto overflow-y-auto rounded-t-[30px] bg-white sm:left-1/2 sm:top-1/2 sm:z-50 sm:-translate-x-1/2 sm:-translate-y-1/2 md:h-[510px] md:w-[689px] md:rounded-[30px]">
        <div className="px-[25px]">
          <div className="mt-4 flex flex-col items-center justify-end md:mt-0">
            {/* {isMobile && (
              <div onClick={onClose} className="mt-4 flex flex-col items-center justify-end md:mt-0">
                <div className="flex w-[90%] items-center justify-center">
                  <RectangleIcon />
                </div>
              </div>
            )} */}
            <div className="mt-[21px] flex w-full items-center">
              <div className="flex w-full justify-center">
                <h2 className="text-center text-xl font-medium text-[#222222]">Bid Preview</h2>
              </div>
              {!isMobile && (
                <button onClick={onClose} className="flex h-[15px] w-[15px] cursor-pointer items-center justify-end">
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
          <div
            className="mt-[15px] flex touch-manipulation items-center gap-[10px] rounded-lg px-[22px] py-4"
            style={{ border: "1px solid #4285F4" }}
          >
            <div className="h-6 w-6">
              <LocationPointIcon />
            </div>
            <p className="flex-1 text-[14px] font-normal text-[#222222]">
              {auctionDetailData?.layer?.property?.address}
            </p>
          </div>
          <div className="mt-[15px] flex flex-col gap-y-[15px] text-[14px] leading-[21px] text-light-black">
            <div className="relative h-[130px]">
              <div className="relative h-[130px] w-full">
                <Image src={imageUrl} alt={`Map at ${latitude}, ${longitude}`} layout="fill" objectFit="cover" />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="mt-[15px] flex flex-col gap-y-[15px] truncate text-[14px] leading-[21px] text-light-black">
              <div className="flex">
                <div>Owner:</div>
                <div className="truncate pl-[15px] text-light-grey">{auctionDetailData?.seller}</div>
              </div>
              <div className="flex">
                <div>Expiration Date:</div>
                <div className="pl-[15px] text-light-grey">{formatDate(auctionDetailData?.endDate)}</div>
              </div>
              <div className="flex">
                <div>Starting Bid:</div>
                <div className="pl-[15px] text-light-grey">$ {auctionDetailData?.initialPrice}</div>
              </div>

              <div className="flex">
                <div>Highest Bid:</div>
                <div className="pl-[15px] text-light-grey">$ {auctionDetailData?.currentPrice}</div>
              </div>
            </div>
            {!isMobile && (
              <div className="flex items-end">
                <div className="text-light-black">
                  <div className="text-[14px] leading-[21px]">Your Bid</div>
                  <div className="text-2xl font-bold leading-9">&#36; {currentUserBid}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`px-[29px] py-[10px] ${isMobile ? "shadow-[0_0px_4.2px_0px_rgba(0,0,0,0.25)]" : "shadow-none"} flex touch-manipulation items-center justify-between gap-[20px] text-[14px]`}
        >
          <div className="w-1/2">
            {isMobile ?
              <div>
                <div className="text-light-black">
                  <div className="text-[14px] leading-[21px]">Your Bid</div>
                  <div className="text-2xl font-bold leading-9">&#36; {currentUserBid}</div>
                </div>
              </div>
            : <div
                onClick={onClose}
                className="w-full cursor-pointer touch-manipulation rounded-[5px] border border-[#0653EA] py-[10px] text-center text-[#0653EA]"
              >
                Cancel
              </div>
            }
          </div>

          <LoadingButton
            isLoading={false}
            onClick={handleBid}
            className="flex w-1/2 cursor-pointer touch-manipulation justify-center rounded-[5px] bg-[#0653EA] px-[17px] py-[10px] text-white"
          >
            Confirm Bid
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default BidPreview;
