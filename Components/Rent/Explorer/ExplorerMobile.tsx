import React, { useState } from "react";
import SearchInput from "./SearchInput";
import { Map, Marker } from "mapbox-gl";
import RentableAirspaceLists from "./RentableAirspaceLists/RentableAirspaceLists";
import { PropertyData } from "@/types";
import RentCard from "./RentCard";
import Spinner from "@/Components/Spinner";
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
}) => {
  const [toggleTray, setToggleTray] = useState(false);
  const handleTrayToggle = (item) => {
    setToggleTray(false);
    setShowClaimModal(true);
    setRentData(item);

  };

  return (
    <div>
      <>
      <div className="md:hidden fixed bottom-0 left-0 w-full z-20 bg-white p-4 shadow-md text-center rounded-t-[30px]">
        <div
          onClick={() => setToggleTray(!toggleTray)}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 animate-pulse h-2 rounded-3xl bg-light-grey"></div>
          <h4>{registeredAddress?.length} Airspaces available</h4>
        </div>
        { (
          <div
            id="scrollableDiv"
            className="h-[450px] overflow-y-auto flex flex-col items-center gap-4 mt-6"
          >
            {" "}
            {loading && (
              <div className="w-full flex justify-center items-center">
                <div className="">
                  <Spinner />
                  <div className="mt-28">Fetching Auctions...</div>
                </div>
              </div>
            )}
            <>
            {!loading && registeredAddress && registeredAddress?.length > 0 && (
              
              <>
                {registeredAddress.length > 0 ? (
                  registeredAddress.map((item, index) => (
                    <div
                      className="mx-auto mb-[15px]"
                      key={index}
                      onClick={() => handleTrayToggle(item)}
                    >
                      <RentCard data={item} />
                    </div>
                  ))
                ) : (
                  <div className="text-center col-span-2 text-light-grey">
                    No auctions found
                  </div>
                )}
              </>

            )}
            </>

          </div>
        )}
      </div>
    </>
      {/* <div className="flex bg-white items-center gap-[15px] pt-[8px] pb-[10px] px-[21px] z-[40]">
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
      /> */}
    </div>
  );
};

export default ExplorerMobile;
