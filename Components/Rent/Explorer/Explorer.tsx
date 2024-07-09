import React, { useState } from "react";
import SearchInput from "./SearchInput";
import RentableAirspaceLists from "./RentableAirspaceLists/RentableAirspaceLists";
import { Map, Marker } from "mapbox-gl";
import { PropertyData } from "@/types";
import { MagnifyingGlassIcon } from "@/Components/Icons";
import Spinner from "@/Components/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import RentCard from "./RentCard";
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
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div
      className="hidden md:block w-[518px] h-[668px] z-20 bg-white m-8 rounded-[30px] p-6 shadow-md overflow-hidden "
      // style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div>
        <div className="text-[18px] font-semibold text-center py-4">
          SkyMarket Hub
        </div>
        <div className="text-[14px]">
          Explore and Own Low-Altitude Airspaces, Your Gateway to Aerial
          Freedom.
        </div>
      </div>
      <div className="flex justify-between items-center my-[15px] w-full border rounded-lg overflow-hidden p-2">
        <input
          placeholder="Search Airspaces Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="focus:outline-none w-10/12 text-[14px]"
        />

        <div className="w-4 h-4">
          <MagnifyingGlassIcon />
        </div>
      </div>
      {/* <SearchInput
        address={address}
        addresses={addresses}
        loading={loading}
        setAddress={setAddress}
        setFlyToAddress={setFlyToAddress}
        setShowOptions={setShowOptions}
        showOptions={showOptions}
      /> */}
      {/* <RentableAirspaceLists
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

<div
            // id="scrollableDiv"
            className="h-[410px] overflow-y-auto thin-scrollbar"
          >
            {" "}
            {loadingReg && (
              <div className="w-full flex justify-center items-center">
                <div className="">
                  <Spinner />
                  <div className="mt-28">Fetching Rentable airspaces...</div>
                </div>
              </div>
            )}
            {!loading && registeredAddress && registeredAddress?.length > 0 && (
              // <InfiniteScroll
              //   dataLength={registeredAddress.length}
              //   next={handleLoadMore}
              //   hasMore={hasMorePage}
              //   loader={undefined}
              //   scrollableTarget="scrollableDiv"
              //   className="w-full grid grid-cols-2 gap-4 border"
              // >
              <div
                className="w-full grid grid-cols-2 gap-4 "
              
              >
                {registeredAddress.length > 0 ? (
                  registeredAddress.map((item, index) => (
                    // <div key={index} onClick={() => handleShowBidDetail(index)}>
                      <RentCard data={item} />
                    // </div>
                  ))
                ) : (
                  <div className="text-center col-span-2 text-light-grey">
                    No auctions found
                  </div>
                )}
              </div>
              // </InfiniteScroll>
            )}
          </div>
    </div>
  );
};
export default Explorer;
