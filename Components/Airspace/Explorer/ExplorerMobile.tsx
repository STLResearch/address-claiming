import React from "react";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "../../Icons";
import SearchInput from "./SearchInput";

interface Address {
  id: string;
  place_name: string;
}
interface ExplorerMobileProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: Address[];
  showOptions: boolean;
  onGoBack: () => void;
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}
const ExplorerMobile: React.FC<ExplorerMobileProps> = ({
  address,
  setAddress,
  addresses,
  showOptions,
  onGoBack,
  setFlyToAddress,
  setShowOptions,
}) => {
  return (
    <div className="z-[40] flex items-center gap-[15px] bg-white px-[21px] py-[19px]">
      <div
        onClick={onGoBack}
        className="flex h-6 w-6 items-center justify-center"
      >
        <ArrowLeftIcon />
      </div>
      <div
        className="relative w-full rounded-lg bg-white"
      >
        <SearchInput
            address={address}
            setAddress={setAddress}
            showOptions={showOptions}
            addresses={addresses}
            setFlyToAddress={setFlyToAddress}
            setShowOptions={setShowOptions}
          />
      </div>
    </div>
  );
};
export default ExplorerMobile;