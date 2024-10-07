import Carousel from "@/Components/Shared/Carousel";
import React from "react";
import { getMapboxStaticImage } from "@/utils/getMapboxStaticImage";

const RentCard = ({ onClickRent, price, title, item }: any) => {
  const images = item?.images || []
  const imageUrl = getMapboxStaticImage(item.latitude, item.longitude);
  images.unshift(imageUrl);
  return (
    <div>
      <div className="w-full overflow-hidden rounded-lg shadow-md" style={{ boxShadow: "0px 4px 10px 0px #0000001a" }}>
        <div className="relative h-[130px] w-full">
          <Carousel images={images} />
        </div>
        <div className="flex w-full justify-between px-4 py-2">
          <div className="w-[60%] truncate text-left text-[14px] font-semibold leading-[20px] text-black">{title}</div>
          <div>
            <div className="text-xs leading-4 text-[#727272]">Rental Price</div>
            <div className="text-right text-xs font-bold leading-[26px] text-[#050505]">&#36;{price.toFixed(2)}</div>
          </div>
        </div>
        <div className="flex h-[51px] justify-center px-[15px] py-[10px]">
          <div className="flex h-[31px] w-full items-center rounded-lg bg-[#0653EA]">
            <button onClick={onClickRent} className="w-full text-[14px] leading-[21px] text-white">
              Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCard;
