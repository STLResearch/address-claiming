import React from "react";
import SearchInput from "./SearchInput";
import RentableAirspaceLists from "./RentableAirspaceLists/RentableAirspaceLists";
import { Map, Marker } from "mapbox-gl";
import { PropertyData } from "@/types";
interface ExplorerProps {
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
}

const Explorer: React.FC<ExplorerProps> = ({
  loadingReg,
  setLoadingRegAddresses,
  loading,
  address,
  setAddress,
  addresses,
  showOptions,
  regAdressShow,
  registeredAddress,
  map,
  setRegisteredAddress,
  marker,
  setMarker,
  setShowClaimModal,
  rentData,
  setRentData,
  setFlyToAddress,
  setShowOptions,
}) => {
  return (
    // <div
    //   className="hidden md:flex bg-[#FFFFFFCC] py-[43px] px-[29px] rounded-[30px] flex-col items-center gap-[15px] max-w-[362px] max-h-full z-20 m-[39px]"
    //   style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    // >
    <div className="hidden md:block w-[518px] h-[668px] z-20 bg-white m-8 rounded-[30px] p-6 shadow-md overflow-hidden ">    
      <div>
      <div className="text-[18px] font-semibold text-center py-4">
        SkyMarket Hub
      </div>
      <p className="text-[14px]">
        Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.
      </p>
      </div>
      <SearchInput
        address={address}
        addresses={addresses}
        loading={loading}
        setAddress={setAddress}
        setFlyToAddress={setFlyToAddress}
        setShowOptions={setShowOptions}
        showOptions={showOptions}
      />
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
      />
    </div>
  );
};
export default Explorer;
