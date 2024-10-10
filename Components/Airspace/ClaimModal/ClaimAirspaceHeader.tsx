import React from "react";
import { ArrowLeftIcon, CloseIcon, InfoIcon } from "@/Components/Icons";

interface ClaimAirspaceHeaderProps {
  onCloseModal: () => void;
}

const ClaimAirspaceHeader: React.FC<ClaimAirspaceHeaderProps> = ({ onCloseModal }) => {
  return (
    <div className="relative flex items-center gap-[20px] md:p-0">
      <div className="h-[12px] w-[16px] md:hidden" onClick={onCloseModal}>
        <ArrowLeftIcon />
      </div>
      <div className="flex w-[95%] items-center justify-center gap-2">
        <h2 className="text-center text-xl font-medium text-[#222222]">Claim Airspace</h2>
        <div className="hidden h-[20px] w-[20px] md:block">
          <InfoIcon />
        </div>
      </div>

      <div
        onClick={onCloseModal}
        className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
      >
        <CloseIcon />
      </div>
    </div>
  );
};

export default ClaimAirspaceHeader;
