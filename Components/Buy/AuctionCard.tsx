import { AuctionDataI } from "@/types";
import { getMapboxStaticImage, getTimeLeft } from "@/utils/marketplaceUtils";
import Image from "next/image";
interface AuctionCardProps {
  data: AuctionDataI;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ data }) => {
  const endDate = new Date(data?.endDate);
  const timeLeft = getTimeLeft(endDate);
  const { latitude, longitude, title } = data?.properties[0] || {};
  const imageUrl = getMapboxStaticImage(latitude, longitude);
  return (
    <div className="w-[350px] md:w-full h-[227px] rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-[130px]">
      <Image
          src={imageUrl}
          alt={`Map at ${latitude}, ${longitude}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="px-4 py-2 flex flex-col items-start">
        <div className="text-sm text-black font-bold">Name</div>
        <div className="text-sm text-[#727272] truncate w-[95%]">{title}</div>
      </div>
      <div className="flex justify-between px-4 pb-2 bg-[#4285F4]/5 pt-1">
        <div className="flex flex-col items-start">
          <div className="text-sm text-[#727272]">Highest Bid</div>
          <div className="text-sm text-black font-bold">{data.highestBid}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-[#727272]">Time Left</div>
          <div className="text-sm text-black font-bold">{timeLeft}</div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
