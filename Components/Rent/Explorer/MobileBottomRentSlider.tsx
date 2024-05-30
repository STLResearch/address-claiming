import React, { useState } from "react";
import RentableAirspaceLists from "./RentableAirspaceLists/RentableAirspaceLists";
import { PropertyData } from "@/types";
import { Map, Marker } from "mapbox-gl";


interface MobileBottomRentSliderProps {
  showClaimModal: boolean;
  loadingReg: boolean;
  registeredAddress: PropertyData[];
  regAdressShow: boolean;
  map: Map | null;
  marker: Marker | null;
  setMarker: React.Dispatch<React.SetStateAction<Marker>>;
  setLoadingRegAddresses: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisteredAddress: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  rentData: PropertyData | null | undefined;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: boolean;
  isMobile?: boolean;
}
const MobileBottomRentSlider: React.FC<MobileBottomRentSliderProps> = ({
  isMobile,
  showClaimModal,
  loadingReg,
  registeredAddress,
  regAdressShow,
  map,
  marker,
  setMarker,
  setLoadingRegAddresses,
  setRegisteredAddress,
  setShowClaimModal,
  setRentData,
  rentData,
}) => {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  return (
    <div onClick={() => setIsFullyVisible((prev) => !prev)}>
      <div
        className={`z-50 fixed bottom-0 mt-4 md:ml-12  bg-white  md:bg-[#FFFFFFCC] no-scrollbar rounded-t-[30px] w-full md:max-w-sm  md:max-h-[600px] max-w-[600px] px-[25px] md:py-[12px] md:rounded-[30px]  mx-auto overflow-x-auto  flex flex-col sm:hidden gap-[15px] pb-[43px] md:pb-0 `}
      >
        <RentableAirspaceLists
          isMobile={isMobile}
          isFullyVisible={isFullyVisible}
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
    </div>
  );
};

export default MobileBottomRentSlider;
