import React, { useEffect, useState } from "react";
import BidAirspaceHeader from "./BidHeader";
import { LocationPointIcon } from "@/Components/Icons";
import Image from "next/image";
import { useMobile } from "@/hooks/useMobile";
import { IoClose } from "react-icons/io5";
import { AuctionDataI } from "@/types";
import { getMapboxStaticImage, getTimeLeft } from "@/utils/marketPlaceUtils";
import { shortenAddress } from "@/utils";
import Accordion from "./Accordion";
import AirspaceHistory from "./AirspaceHistory";
import CustomTable from "./CustomTable";
import Carousel from "@/Components/Shared/Carousel";

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
          <div className="h-2 w-2 rounded-full bg-green-600"></div>
          <div>Complete</div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
        <div>Ongoing</div>
      </div>
    );
  };

  const endDate = auctionDetailData ? new Date(auctionDetailData.endDate) : undefined;
  const timeLeft = endDate ? getTimeLeft(endDate) : undefined;
  const { latitude, longitude, title } = auctionDetailData?.layer?.property || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);

  useEffect(() => {
    setCurrentUserBid(null);
  }, []);

  const isAuctionComplete = endDate ? new Date() > endDate : false;

  const airspaceHistoryMockData = [
    {
      price: "Rental",
      date: "15 december 2023",
      from: "bcndkl,spuifijdczvè”yçh",
    },
    {
      price: "Rental",
      date: "5 december 2023",
      from: "bvqnx,,qzidjcn-’bfszdxd",
    },
    {
      price: "Sell",
      date: "29 november 2023",
      from: "adncjdjf, chzjneofjiochui",
    },
  ];
  const images = [
    { image_url: "/images/imagetest1.jpg" },
    { image_url: "/images/imagetest2.jpg" },
    { image_url: "/images/imagetest3.jpg" },
  ];
  images[0] = { image_url: imageUrl };

  return (
    <div className="fixed inset-0 bottom-[74px] z-50 flex items-start justify-center bg-[#294B63] bg-opacity-50 pt-32 backdrop-blur-[2px] sm:bottom-0">
      <div className="thin-scrollbar short-scrollbar fixed bottom-0 z-[500] flex h-[560px] w-full flex-col gap-[15px] overflow-x-auto overflow-y-auto rounded-t-[30px] bg-white sm:left-1/2 sm:top-1/2 sm:z-50 sm:-translate-x-1/2 sm:-translate-y-1/2 md:h-[640px] md:w-[689px] md:rounded-[30px] md:shadow-md">
        {/* {isMobile && (
          <div onClick={onCloseModal} className="mt-4 flex flex-col items-center justify-end md:mt-0">
            <div className="flex w-[90%] items-center justify-center">
              <RectangleIcon />
            </div>
          </div>
        )} */}
        <div className="shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)] sticky left-0 right-0 top-0 z-[100] -mt-[1px] flex flex-col gap-[15px] bg-white px-[29px] py-[20px]">
          <button className="text-right" onClick={onCloseModal}>
            <IoClose className="h-4 w-4" />
          </button>
          <div className="flex h-[46px] w-full items-center justify-between rounded-lg border border-[#4285F4] px-[22px] py-4">
            <div className="flex items-center gap-[10px]">
              <div className="h-6 w-6">
                <LocationPointIcon />
              </div>
              <p className="flex-1 items-center justify-between text-[14px] font-normal text-[#222222]">
                {auctionDetailData && shortenAddress(auctionDetailData?.layer?.property?.address, 35)}
              </p>
            </div>

            <div className="text-sm text-[#727272]">{getStatus(endDate)}</div>
          </div>
          <div>
            <div className="relative h-[130px] w-full">
              <Image src={imageUrl} alt={`Map at ${latitude}, ${longitude}`} layout="fill" objectFit="cover" />
            </div>
          </div>
          <div className="flex justify-between bg-[#4285F4] bg-opacity-5 px-[15px] py-[10px]">
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] leading-[26px] text-[#727272]">Highest Bid</p>
              <h1 className="text-[14px] font-bold leading-[26px] text-[#050505]">
                ${auctionDetailData?.currentPrice}
              </h1>
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] text-[#727272]">Time left</p>
              <h1 className="text-right text-[14px] font-bold text-[#050505]">{timeLeft ?? "N/A"}</h1>
            </div>
          </div>
          {isAuctionComplete ?
            <div className="flex flex-col gap-[10px] rounded-lg bg-[#f9f9f9] px-[15px] py-[10px]">
              {auctionDetailData && auctionDetailData.AuctionBid.length > 0 ?
                <div>
                  <p className="text-[14px] leading-[26px] text-[#727272]">Bid Winner</p>
                </div>
              : <p className="text-center text-[14px] italic leading-[26px] text-[#727272]">
                  No Bids were placed during this event
                </p>
              }
            </div>
          : <>
              <div>
                <div className="flex w-full justify-between pb-[5px]">
                  <div className="flex">
                    <p className="text-[14px] leading-[21px] text-[#838187]">Your Bid</p>
                    <span className="text-[#E04F64]">*</span>
                  </div>
                  <small className="text-gray-500">
                    Your bid must be at least 1% more than the highest bid{" "}
                    {`(>= $${auctionDetailData && 0.01 * auctionDetailData?.currentPrice})`}
                  </small>
                </div>
                <div
                  className="flex h-[46px] w-full items-center rounded-lg px-[22px] py-[14px] text-[#232F4A]"
                  style={{ border: "1px solid #87878D" }}
                >
                  <label className="pr-2 text-[14px] font-normal leading-[21px]">$</label>
                  <input
                    type="text"
                    name="currentBid"
                    id="currentBid"
                    placeholder=" Place your bid here"
                    value={currentUserBid ?? ""}
                    required
                    onChange={handleCurrentBidInputChanged}
                    className="flex-1 appearance-none border-none text-[14px] leading-[21px] outline-none"
                  />
                </div>
              </div>
              <div className="w-full rounded-lg bg-[#0653EA] text-white">
                <button
                  disabled={!currentUserBid}
                  className={`h-[42px] w-full ${currentUserBid ? "cursor-pointer" : "cursor-not-allowed"}`}
                  onClick={onPlaceBid}
                >
                  Place Bid
                </button>
              </div>
              <hr />

              {auctionDetailData && auctionDetailData.layer.property.propertyStatusId !== 1 && (
                <p className="pt-1 text-sm text-gray-500">
                  Note: By placing a bid,{" "}
                  <span className="font-bold text-black">
                    10% of your bid ($
                    {0.1 * (currentUserBid || 0)})
                  </span>{" "}
                  will be held, and if you win, you must pay the remaining amount within 7 days or forfeit the deposit.
                </p>
              )}

              <div className="opacity-60">
                <Accordion
                  title={(auctionDetailData && `Previous Bids (${auctionDetailData.AuctionBid.length})`) || ""}
                  content={<CustomTable header={["Price($)", "From"]} auctionBids={auctionDetailData?.AuctionBid} />}
                />
              </div>
              <hr />
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default BidDetails;
