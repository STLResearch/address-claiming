import React, { useEffect, useRef } from "react";
import SearchInput from "./SearchInput";
import { Map, Marker } from "mapbox-gl";
import RentableAirspaceLists from "./RentableAirspaceLists/RentableAirspaceLists";
import { PropertyData } from "@/types";
import { BalanceLoader } from "@/Components/Wrapped";
import { handleSelectAddress } from "@/utils/addressUtils/addressFunction";
interface ExplorerMobileProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: { id: string; place_name: string }[];
  showOptions: boolean;
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  loadingReg: boolean;
  setLoadingRegAddresses: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  regAdressShow: boolean;
  registeredAddress: PropertyData[];
  map: Map | null;
  setRegisteredAddress: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  marker: Marker | null | undefined;
  setMarker: React.Dispatch<React.SetStateAction<Marker>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
  rentData: PropertyData | null | undefined;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setRegAdressShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ExplorerMobile: React.FC<ExplorerMobileProps> = ({
  loadingReg,
  loading,
  address,
  setAddress,
  addresses,
  showOptions,
  regAdressShow,
  registeredAddress,
  map,
  marker,
  setMarker,
  setShowClaimModal,
  rentData,
  setRentData,
  setFlyToAddress,
  setShowOptions,
  setLoadingRegAddresses,
  setRegisteredAddress,
  setRegAdressShow,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <div className="z-[40] w-full items-center gap-[15px]">
      <div className="z-[40] flex w-full items-center gap-[15px] bg-white px-[21px] py-6">
        <h1 className="text-xl font-medium">Rent</h1>
        <SearchInput
          address={address}
          addresses={addresses}
          loading={loading}
          setAddress={setAddress}
          setFlyToAddress={setFlyToAddress}
          setShowOptions={setShowOptions}
          showOptions={showOptions}
        />
      </div>

      {showOptions && (
        <div className="px-[30px] py-[19px]">
          <div
            ref={divRef}
            className="z-40 mt-6 max-h-60 w-full flex-col overflow-y-scroll rounded-lg border-t-4 border-blue-500"
          >
            {loading ?
              <div className="flex items-center justify-center pt-8">
                <BalanceLoader />
              </div>
            : addresses.map((item, index) => {
                return (
                  <div key={index} className="flex w-full items-center justify-center">
                    <div className="flex w-full flex-col items-center justify-center rounded-sm border-b-2 p-4">
                      <div
                        className="w-full text-left text-[#222222]"
                        key={item.id}
                        data-value={item.place_name}
                        onClick={() =>
                          handleSelectAddress(item.place_name, setAddress, setFlyToAddress, setShowOptions)
                        }
                      >
                        <div className="w-[90%] text-[14px]">{item.place_name}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
      <RentableAirspaceLists
        loadingReg={loadingReg}
        map={map}
        marker={marker}
        regAdressShow={regAdressShow}
        registeredAddress={registeredAddress}
        rentData={rentData}
        setLoadingRegAddresses={setLoadingRegAddresses}
        setRegisteredAddress={setRegisteredAddress}
        setMarker={setMarker}
        setRentData={setRentData}
        setShowClaimModal={setShowClaimModal}
        setRegAdressShow={setRegAdressShow}
      />
    </div>
  );
};

export default ExplorerMobile;
