import { FC, useState } from "react";
import { LocationPointIcon, ChevronRightIcon } from "../Shared/Icons";
import { PropertyData } from "@/types";

interface MyAirspacesProps {
  airspaces: PropertyData[];
  handleSelectedAirspace: (a: PropertyData) => void
}

const AirspacesList: FC<MyAirspacesProps> = ({ airspaces = [], handleSelectedAirspace }) => {
  const [visibleItems, setVisibleItems] = useState(5);
  const handleSeeMore = () => {
    setVisibleItems((prev) => prev + 5);
  };

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {airspaces.slice(0, visibleItems).map((airspace, index) => (
        <div
          key={index}
          onClick={() => handleSelectedAirspace(airspace)}
          className="w-full flex items-center justify-center  bg-white  border-b-2 "
        >
          <div className="flex items-center justify-between  gap-8 w-[375px] h-[54px] px-4 bg-white ">
            <div className="flex gap-4">
              <div className="w-6 h-6">
                <LocationPointIcon />
              </div>
              <p className="font-normal text-[#222222] text-[14px]">
                {airspace.title ||
                  (airspace.address.length > 30
                    ? `${airspace.address.substring(0, 30)}...`
                    : airspace.address)}
              </p>
            </div>
            <div className="w-4 h-5">
              <ChevronRightIcon />
            </div>
          </div>
        </div>
      ))}

      {visibleItems < airspaces.length && (
        <button onClick={handleSeeMore} className="px-4 mt-4 text-blue-500">
          See More
        </button>
      )}
    </div>
  );
};
export default AirspacesList;
