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
  marker: Marker | null;
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
    <div
      className="hidden md:flex bg-[#FFFFFFCC] py-[43px] px-[29px] rounded-[30px] flex-col items-center gap-[15px] max-w-[362px] max-h-full z-20 m-[39px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex gap-[5px] items-center">
        <p className="text-xl font-medium text-[#222222]">SkyMarket Hub</p>
      </div>
      <p className="text-[15px] font-normal text-[#222222]">
        Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial Freedom.
      </p>
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
        //@ts-ignore
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
