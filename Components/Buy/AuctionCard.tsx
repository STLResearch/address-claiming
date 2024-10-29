import React from "react";
import { AuctionDataI } from "@/types";
import { getMapboxStaticImage, getTimeLeft } from "@/utils/marketPlaceUtils";
import Image from "next/image";
import { shortenAddress } from "@/utils";

interface AuctionCardProps {
  data: AuctionDataI;
  handleShowBidDetail: Function;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ data, handleShowBidDetail }) => {
  const endDate = new Date(data?.endDate);
  const timeLeft = getTimeLeft(endDate);

  const getStatus = (endDate) => {
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
  const { latitude, longitude, title } = data?.layer?.property || {};
  const images = [
    { image_url: "/images/imagetest1.jpg" },
    { image_url: "/images/imagetest2.jpg" },
    { image_url: "/images/imagetest3.jpg" },
  ];

  const imageUrl = getMapboxStaticImage(latitude, longitude);
  images[0] = { image_url: imageUrl };
  return (
    <div
      className="h-[278px] w-[350px] overflow-hidden rounded-lg shadow-md md:w-full"
      style={{ boxShadow: "0px 4px 10px 0px #0000001a" }}
    >
      <div className="relative h-[130px] w-full">
        <Image src={imageUrl} alt={`Map at ${latitude}, ${longitude}`} layout="fill" objectFit="cover" />
      </div>
      <div className="flex flex-col items-start px-4 py-2">
        <div className="flex w-full items-center justify-between text-sm font-bold text-black">
          {shortenAddress(title, 10)}
          <div className="text-xs text-[#727272]">{getStatus(endDate)}</div>
        </div>
        <div className="w-[95%] truncate text-left text-sm text-[#727272]">{shortenAddress(data.assetId, 15)}</div>
      </div>

      <div className="flex justify-between bg-[#4285F4]/5 px-4 pb-2 pt-1">
        <div className="flex flex-col items-start">
          <div className="text-sm text-[#727272]">Highest Bid</div>
          <div className="text-sm font-bold text-black">${data.currentPrice}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-[#727272]">
            {timeLeft.toLowerCase() === "time's up!" ? "Time's up!" : "Time Left"}
          </div>
          <div className="text-sm font-bold text-black">{timeLeft.toLowerCase() !== "time's up!" ? timeLeft : ""}</div>
        </div>
      </div>
      <div className="flex h-[51px] justify-center px-[15px] py-[10px]">
        <div
          className={`${timeLeft.toLowerCase() === "time's up!" ? "bg-gray-300" : "bg-[#0653EA]"} flex h-[31px] w-full items-center rounded-lg`}
        >
          <button
            disabled={timeLeft.toLowerCase() === "time's up!"}
            onClick={() => handleShowBidDetail(data)}
            className="w-full text-[14px] leading-[21px] text-white"
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
