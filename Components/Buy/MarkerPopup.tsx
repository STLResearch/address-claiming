import React from "react";
import { getMapboxStaticImage, getTimeLeft } from "@/utils/marketPlaceUtils";
import { AuctionDataI } from "@/types";
import Carousel from "../Shared/Carousel";

interface MarkerPopupProps {
  auction: AuctionDataI;
  setShowBidDetail: Function;
  setAuctionDetailData: Function;
}

const MarkerPopup: React.FC<MarkerPopupProps> = ({ auction, setShowBidDetail, setAuctionDetailData }) => {
  const endDate = new Date(auction?.endDate);
  const timeLeft = getTimeLeft(endDate);
  const { latitude, longitude, title } = auction?.layer?.property || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);
  const handleShowBidDetail = (item) => {
    setShowBidDetail(true);
    setAuctionDetailData(item);
  };
  const images = [
    { image_url: "/images/imagetest1.jpg" },
    { image_url: "/images/imagetest2.jpg" },
    { image_url: "/images/imagetest3.jpg" },
  ];
  images[0] = { image_url: imageUrl };

  return (
    <div
      className={
        "relative flex h-[151px] w-[321px] flex-row rounded-[20px] rounded-[5px] bg-white sm:flex sm:h-auto sm:w-[266px] sm:flex-col"
      }
    >
      <div className={"relative h-[151px] w-1/2 rounded-xl sm:w-[266px]"}>
        <Carousel images={images} />
      </div>
      <div className={"flex h-[151px] w-1/2 flex-col justify-between sm:w-[266px]"}>
        <div>
          <div className="w-full bg-white px-[15px] py-[5px]">
            <h1 className="text-[14px] font-semibold leading-5">Name</h1>
            <p className="w-[98%] truncate text-xs leading-[26px] text-[#727272]">{auction?.layer?.property?.title}</p>
          </div>
          <div className="flex-end flex h-[46px] w-full items-center justify-between bg-[#4285F4]/5 px-[15px]">
            <div className="flex flex-col">
              <p className="text-xs text-[#727272]">Highest Bid</p>
              <h1 className="text-xs font-bold text-[#050505]">$ {auction?.currentPrice}</h1>
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-[#727272]">Time left</p>
              <h1 className="text-xs font-bold text-[#050505]">{timeLeft}</h1>
            </div>
          </div>
        </div>
        <div className="flex h-[51px] w-full items-center justify-center rounded-b-[5px] px-[15px] py-[10px]">
          <button
            disabled={timeLeft.toLowerCase() === "time's up!"}
            onClick={() => handleShowBidDetail(auction)}
            className={`${timeLeft.toLowerCase() === "time's up!" ? "bg-gray-300" : "bg-[#0653EA]"} flex h-[31px] w-full items-center justify-center rounded-lg border-[#4285F4] px-[10px] py-[10px] text-center text-[14px] leading-[21px] text-white`}
          >
            Place Bid
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkerPopup;
