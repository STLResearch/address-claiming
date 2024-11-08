import React from "react";
import { CloseIcon } from "@/Components/Icons";

interface BidAirspaceHeaderProps {
  onCloseModal: () => void;
}

const BidAirspaceHeader: React.FC<BidAirspaceHeaderProps> = ({ onCloseModal }) => {
  return (
    <div className="relative my-2 flex items-center gap-[20px] md:p-0">
      <div className="flex w-[95%] items-center justify-center gap-2">
        <h2 className="text-center text-xl font-medium text-[#222222]"></h2>
      </div>

      <div onClick={onCloseModal} className="absolute right-0 top-0 ml-auto hidden h-3 w-3 cursor-pointer md:block">
        <CloseIcon />
      </div>
    </div>
  );
};

export default BidAirspaceHeader;
