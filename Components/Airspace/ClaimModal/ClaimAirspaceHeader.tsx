import React from "react";
import { ArrowLeftIcon, CloseIcon, InfoIcon } from "@/Components/Icons";

interface ClaimAirspaceHeaderProps {
  onCloseModal: () => void;
}

const ClaimAirspaceHeader: React.FC<ClaimAirspaceHeaderProps> = ({
  onCloseModal,
}) => {
  return (
    <div className="relative flex items-center gap-[20px] md:p-0">
      <div className="w-[16px] h-[12px] md:hidden" onClick={onCloseModal}>
        <ArrowLeftIcon />
      </div>
      <div className="flex justify-center items-center w-[95%] gap-2 ">
        <h2 className="text-[#222222] text-center font-medium text-xl">
          Claim Airspace
        </h2>
        <div className="hidden md:block w-[20px] h-[20px] ">
          <InfoIcon />
        </div>
      </div>

      <div
        onClick={onCloseModal}
        className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
      >
        <CloseIcon />
      </div>
    </div>
  );
};

export default ClaimAirspaceHeader;
