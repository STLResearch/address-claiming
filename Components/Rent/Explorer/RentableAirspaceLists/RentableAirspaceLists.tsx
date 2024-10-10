import { BalanceLoader } from "@/Components/Wrapped";
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker } from "mapbox-gl";
import RentableAirspace from "./RentableAirspace";
import { PropertyData } from "@/types";
interface RentableAirspaceListsProps {
  loadingReg: boolean;
  regAdressShow: boolean;
  registeredAddress: PropertyData[];
  map: Map | null;
  marker: Marker | null | undefined;
  rentData: PropertyData | undefined | null;
  setMarker: React.Dispatch<React.SetStateAction<Marker>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingRegAddresses: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisteredAddress: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  setRegAdressShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
const RentableAirspaceLists: React.FC<RentableAirspaceListsProps> = ({
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
  setRegAdressShow,
}) => {
  const [selectedAddress, setSelectedAddress] = useState<number | null | undefined>();

  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setRegAdressShow && setRegAdressShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  return (
    <div className="w-full">
      {loadingReg && (
        <div className="mt-2 flex w-full justify-center">
          <BalanceLoader />
        </div>
      )}

      {regAdressShow && (
        <div
          ref={divRef}
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
          className="mt-2 h-auto max-h-60 w-full flex-col overflow-y-scroll bg-white"
        >
          {registeredAddress.map((item) => (
            <RentableAirspace
              key={item.id}
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
