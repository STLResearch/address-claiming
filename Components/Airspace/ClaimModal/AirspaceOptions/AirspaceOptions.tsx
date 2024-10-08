import React from "react";
import Checkbox from "./Checkbox";
import { PropertyData } from "@/types";
import { ClaimAirspaceSteps } from "../ClaimModal";

interface AirspaceOptionsProps {
  rent: boolean;
  sell: boolean | undefined;
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
  noFlyZone: boolean;
  setisNoFlyZone: React.Dispatch<React.SetStateAction<boolean>>;
  setShowselldetails: React.Dispatch<React.SetStateAction<boolean>>;
  setShowrentdetails: React.Dispatch<React.SetStateAction<boolean>>;
  setSteps: React.Dispatch<React.SetStateAction<ClaimAirspaceSteps>>;
}

const AirspaceOptions: React.FC<AirspaceOptionsProps> = ({
  rent,
  sell,
  setData,
  noFlyZone,
  setisNoFlyZone,
  setShowselldetails,
  setShowrentdetails,
  setSteps,
}) => {
  const handleRentChange = () => {
    setData((prev) => ({
      ...prev,
      rent: true,
      sell: false,
    }));
    setShowrentdetails((prev) => !prev);
  };

  const handleSellChange = () => {
    setData((prev) => ({
      ...prev,
      sell: !prev.sell,
      rent: false,
    }));
    setShowselldetails((prev) => !prev);
    // SetShowrentdetails(false);
  };

  const handlenoFlyZone = () => {
    setData((prev) => ({
      ...prev,
      noFlyZone: true,
      rent: false,
      sell: false,
    }));
  };
  return (
    <div className="flex flex-col gap-[10px] mt-2 md:mt-3">
      <p className="text-[14px] font-normal text-[#838187]">
        Are you looking to Rent or Sell your airspace?
      </p>
      <div className="flex items-center gap-[7px]">
        <Checkbox label="Rent" checked={!!rent} onChange={handleRentChange} />
        <Checkbox label="Sell" checked={!!sell} onChange={handleSellChange} />
        <Checkbox
          label="No-Fly Zone"
          checked={!!noFlyZone}
          onChange={handlenoFlyZone}
        />
      </div>
    </div>
  );
};

export default AirspaceOptions;
