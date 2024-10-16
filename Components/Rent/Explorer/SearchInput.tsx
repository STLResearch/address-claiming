import React from "react";

import { MagnifyingGlassIcon } from "@/Components/Shared/Icons";
import { BalanceLoader } from "@/Components/Wrapped";
import { handleSelectAddress } from "@/utils/addressUtils/addressFunction";
import { useMobile } from "@/hooks/useMobile";

interface SearchInputProps {
  address: string;
  loading: boolean;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  showOptions: boolean;
  addresses: { id: string; place_name: string }[];
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchInput: React.FC<SearchInputProps> = ({
  address,
  loading,
  setAddress,
  showOptions,
  addresses,
  setFlyToAddress,
  setShowOptions,
}) => {
  const { isMobile } = useMobile();
  return (
    <div>
      {isMobile ? (
        <div>
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
              placeholder="Search Airspaces"
              className="w-full pr-[20px] outline-none text-sm"
            />
            <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
              <MagnifyingGlassIcon />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="relative px-[22px] py-[16px] rounded-lg w-full"
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
              className="outline-none w-full pr-[20px]"
            />
            <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
              <MagnifyingGlassIcon />
            </div>
          </div>
          <div className="overflow-y-scroll max-h-60 w-full flex-col z-20 bg-white">
            {loading ? (
              <div className="pt-8 flex justify-center items-center">
                <BalanceLoader />
              </div>
            ) : (
              addresses.map((item) => {
                return (
                  <div
                    key={item.id}
                    data-value={item.place_name}
                    onClick={() =>
                      handleSelectAddress(
                        item.place_name,
                        setAddress,
                        setFlyToAddress,
                        setShowOptions,
                      )
                    }
                    className="w-full p-5 text-left text-[#222222]  "
                    style={{
                      borderTop: "0.2px solid #222222",
                    }}
                  >
                    {item.place_name}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
