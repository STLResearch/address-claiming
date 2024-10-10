import { FC, useState } from "react";
import { LocationPointIcon, ChevronRightIcon } from "../Shared/Icons";
import { PropertyData } from "@/types";

interface MyAirspacesProps {
  airspaces: PropertyData[];
}

const AirspacesList: FC<MyAirspacesProps> = ({ airspaces = [] }) => {
  const [visibleItems, setVisibleItems] = useState(5);
  const handleSeeMore = () => {
    setVisibleItems((prev) => prev + 5);
  };

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {airspaces.slice(0, visibleItems).map((airspace, index) => (
        <div key={index} className="flex w-full items-center justify-center border-b-2 bg-white">
          <div className="flex h-[54px] w-[375px] items-center justify-between gap-8 bg-white px-4">
            <div className="flex gap-4">
              <div className="h-6 w-6">
                <LocationPointIcon />
              </div>
              <p className="text-[14px] font-normal text-[#222222]">
                {airspace.title ||
                  (airspace.address.length > 30 ? `${airspace.address.substring(0, 30)}...` : airspace.address)}
              </p>
            </div>
            <div className="h-5 w-4">
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      ))}

      {visibleItems < airspaces.length && (
        <button onClick={handleSeeMore} className="mt-4 px-4 text-blue-500">
          See More
        </button>
      )}
    </div>
  );
};
export default AirspacesList;
