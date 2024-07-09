import { BalanceLoader } from "@/Components/Wrapped";
import React, {  useState } from "react";
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
  setLoadingRegAddresses: React.Dispatch<React.SetStateAction<boolean>>; //check
  setRegisteredAddress: React.Dispatch<React.SetStateAction<PropertyData[]>>;
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
}) => {
  const [selectedAddress, setSelectedAddress] = useState<number | null | undefined>();
  console.log(registeredAddress,"hello hello")
  return (
    <div className="w-full">
      {loadingReg && (
        <div className="mt-4 w-full flex justify-center">
          <BalanceLoader />
        </div>
      )}

      {regAdressShow && (
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
