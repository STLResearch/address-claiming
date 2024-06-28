import React from "react";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "../../Icons";
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
  handleSelectAddress: (value: any) => void
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
    <div className="enter-address-step z-[40] flex items-center gap-[15px] bg-white px-[21px] py-[19px]">
      <div
        onClick={onGoBack}
        className="flex h-6 w-6 items-center justify-center"
      >
        <ArrowLeftIcon />
      </div>
      <div
        className="relative w-full rounded-lg bg-white px-[22px] py-[16px]"
        style={{ border: "1px solid #87878D" }}
      >
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchAirspaces"
          id="searchAirspaces"
          placeholder="Search Airspaces"
          className="w-full pr-[20px] outline-none"
        />
        <div className="absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2">
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className="absolute left-0 top-[55px] w-full flex-col bg-white">
            {addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  // value={item.place_name}
                  onClick={() => handleSelectAddress(item.place_name)}
                  className="w-full p-5 text-left text-[#222222]"
                  style={{
                    borderTop: "0.2px solid #222222",
                  }}
                >
                  {item.place_name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default ExplorerMobile;