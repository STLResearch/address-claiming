import BidAirspaceHeader from "./BidHeader";
import { LocationPointIcon, RectangleIcon } from "@/Components/Icons";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import { IoExpand } from "react-icons/io5";
import { AuctionDataI } from "@/types";
import { getMapboxStaticImage, getTimeLeft } from "@/utils/marketplaceUtils";
import { shortenAddress } from "@/utils";
import { useEffect, useState } from "react";
import BidsViewModal from "./BidsView";

interface BidDetailsProps {
  auctionDetailData: AuctionDataI | undefined;
  onCloseModal: () => void;
  onPlaceBid: () => void;
  currentUserBid: number | null;
  setCurrentUserBid: React.Dispatch<React.SetStateAction<number | null>>;
}

const BidDetails: React.FC<BidDetailsProps> = ({
  auctionDetailData,
  onCloseModal,
  onPlaceBid,
  setCurrentUserBid,
  currentUserBid,
}) => {
  const { isMobile } = useMobile();
  const [openBidsModal, setOpenBidsModal] = useState(false);

  const handleCurrentBidInputChanged = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    const decimalCount = inputValue.split(".").length - 1;
    if (decimalCount > 1) {
      inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
    }

    setCurrentUserBid(inputValue);
  };

  const getStatus = (endDate: Date | undefined) => {
    if (!endDate) return;
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-600"></div>
          <div>Complete</div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
          <div>Ongoing</div>
        </div>
      );
    }
  };

  const endDate = auctionDetailData
    ? new Date(auctionDetailData.endDate)
    : undefined;
  const timeLeft = endDate ? getTimeLeft(endDate) : undefined;
  const { latitude, longitude, title } = auctionDetailData?.properties[0] || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);

  useEffect(() => {
    setCurrentUserBid(null);
  }, []);

  const sortedBids =
    auctionDetailData?.bids.sort((a, b) => b.bidOffer - a.bidOffer) || null;

  console.log({ sortedBids });

  const isAuctionComplete = endDate ? new Date() > endDate : false;

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-32 justify-center bg-[#294B63] bg-opacity-50 backdrop-blur-[2px]">
      {openBidsModal && (
        <BidsViewModal
          auctionDetailData={auctionDetailData}
          onClose={() => setOpenBidsModal(false)}
        />
      )}
      <div className="fixed bottom-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white rounded-t-[30px] md:rounded-[30px] w-full h-[560px] md:h-[530px] overflow-y-auto overflow-x-auto md:w-[689px] z-[500] sm:z-50 flex flex-col gap-[15px] md:shadow-md">
        {isMobile && (
          <div
            onClick={onCloseModal}
            className="flex flex-col justify-end items-center mt-4 md:mt-0"
          >
            <div className="w-[90%] flex justify-center items-center">
              <RectangleIcon />
            </div>
          </div>
        )}
        <div className="z-[100] sticky top-0 left-0 right-0 bg-white py-[20px] px-[29px] -mt-[1px] flex flex-col gap-[15px] shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)]">
          <BidAirspaceHeader onCloseModal={onCloseModal} />
          <div className="flex border border-[#4285F4] w-full items-center justify-between py-4 px-[22px] rounded-lg h-[46px]">
            <div className="flex items-center gap-[10px] ">
              <div className="w-6 h-6">
                <LocationPointIcon />
              </div>
              <p className="font-normal text-[#222222] text-[14px] flex-1 items-center justify-between">
                {shortenAddress(auctionDetailData?.properties[0]?.address, 35)}
              </p>
            </div>

            <div className="text-sm text-[#727272]">{getStatus(endDate)}</div>
          </div>
          <div>
            <div className="relative w-full h-[130px]">
              <Image
                src={imageUrl}
                alt={`Map at ${latitude}, ${longitude}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="flex justify-between px-[15px] py-[10px] bg-[#4285F4] bg-opacity-5">
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] leading-[26px] text-[#727272]">
                Highest Bid
              </p>
              <h1 className="text-[14px] leading-[26px] font-bold text-[#050505]">
                ${auctionDetailData?.highestBid}
              </h1>
            </div>

            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] leading-[26px] text-[#727272]">
                Minimum Bid
              </p>
              <h1 className="text-[14px] text-center leading-[26px] font-bold text-[#050505]">
                ${auctionDetailData?.price}
              </h1>
            </div>

            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] leading-[26px] text-[#727272] flex items-center gap-1">
                Total Bids
                <button onClick={() => setOpenBidsModal(true)}>
                  <IoExpand className="animate-pulse hover:scale-120" />
                </button>
              </p>
              <h1 className="text-[14px] text-center leading-[26px] font-bold text-[#050505]">
                {auctionDetailData?.totalBid}
              </h1>
            </div>

            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] text-[#727272]">Time left</p>
              <h1 className="text-[14px] text-right font-bold text-[#050505]">
                {timeLeft ?? "N/A"}
              </h1>
            </div>
          </div>
          {isAuctionComplete ? (
            <div className="flex flex-col gap-[10px] px-[15px] py-[10px] bg-[#f9f9f9] rounded-lg">
              {auctionDetailData && auctionDetailData.bids.length > 0 ? (
                <div>
                  <p className="text-[14px] leading-[26px] text-[#727272]">
                    Bid Winner
                  </p>
                  <div className="flex items-center gap-8">
                    <h1 className="text-[14px]  leading-[26px] font-bold text-[#050505]">
                      {shortenAddress(
                        (sortedBids && sortedBids[0]?.bidder) || "",
                        10
                      )}
                    </h1>

                    <h1 className="text-[14px]  leading-[26px] font-bold text-[#050505]">
                      $ {sortedBids && sortedBids[0]?.bidOffer}
                    </h1>
                  </div>
                </div>
              ) : (
                <p className="text-[14px] leading-[26px] text-[#727272] text-center italic">
                  No Bids were placed during this event
                </p>
              )}
            </div>
          ) : (
            <>
              <div>
                <div className="flex pb-[5px]">
                  <p className="text-[#838187] text-[14px] leading-[21px]">
                    Your Bid
                  </p>
                  <span className="text-[#E04F64]">*</span>
                </div>
                <div
                  className="flex w-full items-center text-[#232F4A] py-[14px] px-[22px] rounded-lg h-[46px]"
                  style={{ border: "1px solid #87878D" }}
                >
                  <label className="text-[14px] font-normal leading-[21px]">
                    $
                  </label>
                  <input
                    type="text"
                    name="currentBid"
                    id="currentBid"
                    placeholder=" Place your bid here"
                    value={currentUserBid ?? ""}
                    required
                    onChange={handleCurrentBidInputChanged}
                    className="appearance-none outline-none border-none flex-1 text-[14px] leading-[21px]"
                  />
                </div>
              </div>
              <div className="w-full bg-[#0653EA] text-white rounded-lg">
                <button
                  disabled={!currentUserBid}
                  className={`w-full h-[42px] ${
                    currentUserBid ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  onClick={onPlaceBid}
                >
                  Place a Bid
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidDetails;
