import React, { useState } from "react";
import { InfoIcon } from "../../Icons";
import SearchInput from "./SearchInput";

interface ExplorerProps {
  address: string; 
  setAddress: React.Dispatch<React.SetStateAction<string>>; 
  addresses: { id: string; place_name: string; }[];
  showOptions: boolean;
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  onClaimAirspace: () => void; 
  flyToAddress: string; 

}

const Explorer: React.FC<ExplorerProps> = ({
  address,
  setAddress,
  addresses,
  showOptions,
  setFlyToAddress,
  setShowOptions,
  onClaimAirspace,
  flyToAddress
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);

  return (
    <div
      className="z-20 m-[39px] hidden max-h-full max-w-[362px] flex-col items-center gap-[15px] rounded-[30px] bg-[#FFFFFFCC] px-[29px] py-[43px] md:flex"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex items-center gap-[5px]">
        <p className="text-xl font-medium text-[#222222]">Claim Airspace</p>
        <div
          onClick={() => setIsInfoVisible((prev) => !prev)}
          className="relative flex h-[20px] w-[20px] items-center justify-center"
        >
          <InfoIcon />
          {isInfoVisible && (
            <div className="absolute -top-4 left-6 w-[189px] rounded-[4px] bg-[#CCE3FC] p-[12px] text-[10px] font-normal italic">
              Note that we store your data securely with advanced encryption and
              strict authentication measures to ensure utmost privacy and
              protection.
            </div>
          )}
        </div>
      </div>
      <p className="text-[15px] font-normal text-[#222222]">
        Ready to claim your airspace? No registered airspace yet, but exciting
        times ahead!
      </p>
      <SearchInput
            address={address}
            setAddress={setAddress}
            showOptions={showOptions}
            addresses={addresses}
            setFlyToAddress={setFlyToAddress}
            setShowOptions={setShowOptions}
          />

      {flyToAddress && flyToAddress !== "" && (
        <div
          onClick={onClaimAirspace}
          className="w-full cursor-pointer rounded-lg bg-[#0653EA] py-[16px] text-center text-[15px] font-normal text-white"
        >
          Claim Airspace
        </div>
      )}
    </div>
  );
};

export default Explorer;
