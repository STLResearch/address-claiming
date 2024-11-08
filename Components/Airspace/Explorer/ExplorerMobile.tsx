import React from "react";
import {
  ArrowLeftIcon,
  LocationPointIcon,
  MagnifyingGlassIcon,
} from "../../Icons";
import { useTour } from "@reactour/tour";
import { useSearchParams } from "next/navigation";
interface Address {
  id: string;
  place_name: string;
}

interface PropsI {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: Address[];
  showOptions: boolean;
  handleSelectAddress: (value: any) => void;
  onGoBack: () => void;
}

const ExplorerMobile = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  onGoBack,
}: PropsI) => {
  const searchParams = useSearchParams();
  const { isOpen } = useTour();
  return (
    <div className="enter-address-step z-[20] flex items-center gap-[15px] bg-white px-[21px] py-[19px]">
      <h1 className="text-xl font-medium">Air Rights</h1>
      <div
        className="relative w-[230px] h-[49px] rounded-lg bg-white px-[22px] py-[10px]"
        style={{ border: "1px solid #87878D" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchAirspaces"
          id="searchAirspaces"
          placeholder="Search Air Rights"
          className="w-full pr-[20px] outline-none text-sm"
        />
        <div className="absolute right-[20px] top-1/2 h-[15px] w-[15px] -translate-y-1/2">
          <MagnifyingGlassIcon />
        </div>
      </div>
    </div>
  );
};
export default ExplorerMobile;
