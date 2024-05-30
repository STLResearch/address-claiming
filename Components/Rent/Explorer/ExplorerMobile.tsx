import React, { useState } from "react";
import SearchInput from "./SearchInput";
import { Map, Marker } from "mapbox-gl";
import { PropertyData } from "@/types";
import RentAirspaceLists from "./MobileBottomRentSlider";
interface ExplorerMobileProps {
  isMobile: boolean;
  onGoBack: () => void;
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
  showClaimModal: boolean;
}
const ExplorerMobile: React.FC<ExplorerMobileProps> = ({
  showClaimModal,
  isMobile,
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
  onGoBack,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <div>
      <div className="flex bg-white items-center gap-[15px] pt-[8px] pb-[10px] px-[21px] z-[40]">
        <SearchInput
          onGoBack={onGoBack}
          isMobile={isMobile}
          address={address}
          addresses={addresses}
          loading={loading}
          setAddress={setAddress}
          setFlyToAddress={setFlyToAddress}
          setShowOptions={setShowOptions}
          showOptions={showOptions}
        />
      </div>
      <RentAirspaceLists
        isMobile={true}
        setToggle={setToggle}
        toggle={toggle}
        showClaimModal={showClaimModal}
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

export default ExplorerMobile;
