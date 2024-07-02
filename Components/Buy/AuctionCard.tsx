import { AuctionPropertyI } from "@/types";
import { getTimeLeft } from "@/utils/marketplaceUtils/getTimeLeft";
import Image from "next/image";

interface AuctionCardProps {
  data: AuctionPropertyI;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ data }) => {
  console.log(data?.metadata?.data?.uri,"the data test")
  const endDate = new Date(data?.endDate);
  const timeLeft = getTimeLeft(endDate)
  return (
    <div className="w-[350px] md:w-full h-[227px] rounded-lg shadow-md overflow-hidden">
      <div className="w-full h-[130px]">
        <Image
          className="w-full h-[130px] bg-contain"
          width={220}
          height={130}
          src={data?.metadata?.data?.uri}
          alt={"airspace image"}
        />
      </div>
      <div className="px-4 py-2 flex flex-col items-start">
        <div className="text-[12px] text-black font-bold">Name</div>
        <div className="text-[12px] text-[#727272] truncate w-[95%]">{data?.properties[0]?.title}</div>
      </div>
      <div className="flex justify-between px-4 pb-2 bg-[#4285F4]/5 pt-1">
        <div className="flex flex-col items-start">
          <div className="text-[12px] text-[#727272]">Highest Bid</div>
          <div className="text-[12px] text-black font-bold">
            {data.highestBid}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-[12px] text-[#727272]">Time Left</div>
          <div className="text-[12px] text-black font-bold">
            {timeLeft}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
