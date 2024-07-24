import React from "react";
import Image from "next/image";
import { getMapboxStaticImage } from "@/utils";

interface MarkerPopupProps {
  data: any;
}

const RentMarkerPopup: React.FC<MarkerPopupProps> = ({ data }) => {
  const { latitude, longitude,title } = data || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);
  return (
    <div
      className={
        " relative bg-white rounded-[5px] flex flex-row w-[321px] sm:w-[266px] h-[130px] sm:h-auto sm:flex sm:flex-col "
      }
    >
      <div className={" w-1/2 sm:w-[266px] relative h-[130px]"}>
      <Image
          src={imageUrl}
          alt={`Map at ${latitude}, ${longitude}`}
          layout="fill"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div
        className={"w-1/2 h-[130px] sm:w-[266px] flex flex-col justify-between"}
      >
        <div className="px-[15px] py-[5px] bg-white w-full">
          <h1 className="text-[14px] font-semibold leading-5 ">Name</h1>
          <p className="text-xs leading-[26px] text-[#727272] truncate w-[98%]">
            {title}
          </p>
        </div>
        <div className="flex justify-between flex-end px-[15px] py-[10px] w-full bg-[#4285F4]/5 ">
          <div className="flex flex-col ">
            <p className="text-xs leading-[16px] text-[#727272]">Rental Price</p>
            <h1 className="text-xs  leading-[26px] font-bold text-[#050505]">
              ${data?.price}
            </h1>
          </div>
          <div>
            <button className="rounded-[8px] px-[10px] py-[5px] text-white leading-[21px] text-[14px] first-letter: border border-[#4285F4] bg-[#0653EA]">
                Rent
            </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RentMarkerPopup;