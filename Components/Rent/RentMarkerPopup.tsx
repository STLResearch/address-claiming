import React from "react";
import Carousel from "../Shared/Carousel";
import { getMapboxStaticImage } from "@/utils/getMapboxStaticImage";

interface RentPopupProps {
  rent: any;
  setShowBidDetail: Function;
  setAuctionDetailData: Function;
}

const RentPopup: React.FC<RentPopupProps> = ({ rent, setShowBidDetail, setAuctionDetailData }) => {
  const handleShowBidDetail = (item) => {
    setShowBidDetail(true);
    setAuctionDetailData(item);
  };
  const images = rent?.images || [];
  const imageUrl = getMapboxStaticImage(rent.latitude, rent.longitude);
  images.unshift(imageUrl);
  return (
    <div
      className={
        "relative flex h-[100px] w-[350px] flex-row rounded-[5px] bg-white sm:flex sm:h-auto sm:w-[266px] sm:flex-col"
      }
    >
      <div className={"relative h-[100px] w-[150px] sm:w-[266px]"}>
        <Carousel images={images} />
      </div>
      <div className={"flex h-[100px] py-[5px] w-[200px] flex-col justify-between sm:w-[266px]"}>
        <div className="flex w-[95%] sm:w-full">
          <div className="flex w-full justify-between px-4">
            <div className="w-[60%] truncate text-left text-[14px] font-semibold leading-[20px] text-black">
              {rent?.title}
            </div>
            <div>
              <div className="text-xs leading-4 text-[#727272]">Rental Price</div>
              <div className="text-right text-xs font-bold leading-[26px] text-[#050505]">
                &#36;{rent?.price && rent?.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[51px] w-full py-[10px] items-center justify-center rounded-b-[5px] px-[15px] ">
          <button
            onClick={() => handleShowBidDetail(rent)}
            className="flex h-[31px] w-full items-center justify-center rounded-lg border-[#4285F4] bg-[#0653EA] px-[10px]  text-center text-[14px] leading-[21px] text-white"
          >
            Rent
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentPopup;
