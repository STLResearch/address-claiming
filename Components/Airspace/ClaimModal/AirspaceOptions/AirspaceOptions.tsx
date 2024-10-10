import React from "react";
import Checkbox from "./Checkbox";
import { PropertyData } from "@/types";

interface AirspaceOptionsProps {
  isRentableAirspace: boolean;
  sell: boolean | undefined;
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const AirspaceOptions: React.FC<AirspaceOptionsProps> = ({
  isRentableAirspace,
  sell,
  setData,
}) => {
  const handleRentChange = () => {
    setData((prev) => ({
      ...prev,
      isRentableAirspace: !prev.isRentableAirspace,
      sell: false,
    }));
  };

  const handleSellChange = () => {
    setData((prev) => ({
      ...prev,
      sell: !prev.sell,
      rent: false,
    }));
  };

  return (
    <div className="flex flex-col gap-[10px] mt-2 md:mt-3">
      <p className="text-[14px] font-normal text-[#838187]">
        Are you looking to Rent or Sell your air rights?
      </p>
      <div className="flex items-center gap-[7px]">
        <Checkbox
          label="Rent"
          checked={isRentableAirspace}
          onChange={handleRentChange}
        />
        <Checkbox
          label="Sell"
          checked={sell ? sell : false}
          disabled
          onChange={handleSellChange}
        />
      </div>
    </div>
  );
};

export default AirspaceOptions;
