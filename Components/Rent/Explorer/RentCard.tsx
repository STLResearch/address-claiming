// import { AuctionDataI } from "@/types";
// import { getMapboxStaticImage, getTimeLeft } from "@/utils/marketplaceUtils";
import { getMapboxStaticImage } from "@/utils";
import Image from "next/image";

const RentCard: React.FC<any> = ({ data }) => {
//   const endDate = new Date(data?.endDate);
//   const timeLeft = getTimeLeft(endDate);
  const { latitude, longitude, title } = data || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);
  return (
    <div className="w-[350px] md:w-full h-[232px] rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-[130px]">
      <Image
          src={imageUrl}
          alt={`Map at ${latitude}, ${longitude}`}
          fill
          sizes="100%"
        />
        <div>
          
        </div>
      </div>
      <div className="px-4 py-2 flex flex-col items-start">
        <div className="text-sm text-black font-bold">Name</div>
        <div className="text-sm text-[#727272] truncate w-[95%]">{title}</div>
      </div>
      <div className="flex justify-between px-4 pb-2 bg-[#4285F4]/5 pt-1">
        <div className="flex flex-col items-start">
          <div className="text-sm text-[#727272]">Rental Price</div>
          <div className="flex h-full items-end text-sm text-black font-bold">&#36;{data.price}</div>
        </div>
        {/* <div className="flex flex-col items-end">
          <div className="text-sm text-[#727272]">Time Left</div>
          <div className="text-sm text-black font-bold">{timeLeft}</div>
        </div> */}
        <div>
            <button className="rounded-[8px] px-[10px] py-[5px] text-white leading-[21px] text-[14px] first-letter: border border-[#4285F4] bg-[#0653EA]">
                Rent
            </button>
        </div>
      </div>
    </div>
  );
};

export default RentCard;