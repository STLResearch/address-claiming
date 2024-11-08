import React from "react";
import SearchInput from "./SearchInput";
import RentableAirspaceLists from "./RentableAirspaceLists/RentableAirspaceLists";
import { PropertyData } from "@/types";
interface ExplorerProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: { id: string; place_name: string }[];
  showOptions: boolean;
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  loadingReg: boolean;
  loading: boolean;
  regAdressShow: boolean;
  registeredAddress: PropertyData[];
  setShowRentDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const Explorer: React.FC<ExplorerProps> = ({
  loadingReg,
  loading,
  address,
  setAddress,
  addresses,
  showOptions,
  regAdressShow,
  registeredAddress,
  setShowRentDetail,
  setRentData,
  setFlyToAddress,
  setShowOptions,
}) => {
  return (
    <div className="hidden md:block w-[518px] h-[688px] z-20 bg-white m-8 rounded-[30px] p-6 shadow-md overflow-hidden ">    
      <div>
      <div className="text-[18px] font-semibold text-center py-4">
        SkyMarket Hub
      </div>
      <p className="text-[14px]">
        Explore and Own Low-Altitude Air Rights, Your Gateway to Aerial Freedom.
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
        regAdressShow={regAdressShow}
        registeredAddress={registeredAddress}
        setRentData={setRentData}
        setShowRentDetail={setShowRentDetail}
      />
    </div>
  );
};
export default Explorer;
