import { BalanceLoader } from "@/Components/Wrapped";
import React, {  useState } from "react";
import { Map, Marker } from "mapbox-gl";
import RentableAirspace from "./RentableAirspace";
import { useRentableAirspaces } from "@/hooks/useRentableAirspaces";
import { PropertyData } from "@/types";
import { RectangleIcon } from "@/Components/Icons";
interface RentableAirspaceListsProps {
  isFullyVisible?:boolean;
  isMobile?:boolean;
  showClaimModal?:boolean;
  loadingReg: boolean;
  regAdressShow: boolean;
  registeredAddress: PropertyData[];
  map: Map | null;
  marker: Marker;
  rentData: PropertyData | undefined | null;
  setMarker: React.Dispatch<React.SetStateAction<Marker>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingRegAddresses: React.Dispatch<React.SetStateAction<boolean>>; //check
  setRegisteredAddress: React.Dispatch<React.SetStateAction<PropertyData[]>>;
}
const RentableAirspaceLists: React.FC<RentableAirspaceListsProps> = ({
  isFullyVisible,
  isMobile,
  showClaimModal,
  setRegisteredAddress,
  setLoadingRegAddresses,
  loadingReg,
  regAdressShow,
  registeredAddress,
  map,
  marker,
  setMarker,
  setRentData,
  setShowClaimModal,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<number | null | undefined>();
  useRentableAirspaces({
    map,
    setRentData,
    setShowClaimModal,
    setLoadingRegAddresses,
    setRegisteredAddress,
  });

  return (
    <div className="w-full">
        {!showClaimModal && isMobile && (
          <div className=" flex flex-col justify-end items-center mt-4 md:mt-0 ">
            <div className=" w-[90%] flex justify-center  items-center  md:hidden">
              <RectangleIcon />
            </div>
            {!loadingReg && (
              <div className="mt-[21px] text-light-black text-xl font-medium leading-[30px]">
                {registeredAddress?.length} airspaces to rent
              </div>
            )}
          </div>
        )}
      {loadingReg && (
        <div className="mt-4 w-full flex justify-center">
          <BalanceLoader />
        </div>
      )}

      {regAdressShow && (isFullyVisible && isMobile) && (
        <div
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
          className=" mt-5 bg-white w-full flex-col h-auto max-h-60 overflow-y-scroll"
        >
          {registeredAddress.map((item) => (
            <RentableAirspace
              item={item}
              map={map}
              marker={marker}
              selectedAddress={selectedAddress}
              setMarker={setMarker}
              setRentData={setRentData}
              setSelectedAddress={setSelectedAddress}
              setShowClaimModal={setShowClaimModal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RentableAirspaceLists;
