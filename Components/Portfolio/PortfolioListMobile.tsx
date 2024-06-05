import React from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Spinner from "../Spinner";
import PortfolioItemMobile from "./PortfolioItemMobile";
import AirspacesEmptyMessage from "./AirspacesEmptyMessage";
import usePortfolioList, { PortfolioTabEnum } from "@/hooks/usePortfolioList";

const PortfolioListMobile = ({ selectAirspace }) => {
  const {
    highlightActiveTab,
    handleTabSwitch,
    handlePrevPage,
    handleNextPage,
    loading,
    airspaceList,
    pageNumber
  } = usePortfolioList();
  
  return (
    <div className="overflow-x-hidden mb-24">
      <div
        className=" flex items-center overflow-x-scroll border-b border-[#5D7285]/50 gap-6"
        style={{ scrollbarWidth: "none", scrollbarColor: "none" }}
      >
        <div
          className={highlightActiveTab(PortfolioTabEnum.VERIFIED, 'px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap')}
          onClick={() => handleTabSwitch(PortfolioTabEnum.VERIFIED)}
        >
          Verified Airspaces
        </div>
        <div
          className={highlightActiveTab(PortfolioTabEnum.RENTED, 'px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap')}
          onClick={() => handleTabSwitch(PortfolioTabEnum.RENTED)}
        >
          Rented Airspaces
        </div>
        <div
          className={highlightActiveTab(PortfolioTabEnum.UNVERIFIED, 'px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap')}
          onClick={() => handleTabSwitch(PortfolioTabEnum.UNVERIFIED)}
        >
          Pending Verification
        </div>
        <div
          className={highlightActiveTab(PortfolioTabEnum.REJECTED, 'px-8 py-2 cursor-pointer transition ease-linear delay-75 whitespace-nowrap')}
          onClick={() => handleTabSwitch(PortfolioTabEnum.REJECTED)}
        >
          Rejected Airspaces
        </div>
      </div>

      {loading ? (
        <div>
          {" "}
          <Spinner />
        </div>
      ) : (
        <div className="w-screen ">
            <div className="flex flex-col gap-[2px] pb-2  min-h-[70vh] ">
              {airspaceList &&
                airspaceList[0] &&
                airspaceList[0].address ? (
                  airspaceList.map(({ address, type }, index) => (
                  <PortfolioItemMobile
                    airspaceName={address}
                    key={index}
                    tags={[true, false, false, false]}
                    type={type}
                    selectAirspace={() => selectAirspace(index)}
                  />
                ))
              ) : (
                <AirspacesEmptyMessage />
              )}
            </div>

          <div className="flex flex-col w-full text-gray-600">
            <div className="flex self-end items-center gap-2 w-[5rem]">
              <button
                onClick={handlePrevPage}
                disabled={pageNumber === 1}
                className={`${pageNumber === 1 ? "cursor-not-allowed" : "cursor-pointer"} p-1 border rounded-lg border-gray-200`}
              >
                <RxCaretLeft />
              </button>
              <div>
                {pageNumber}
              </div>
              <button
                onClick={handleNextPage}
                disabled={airspaceList?.length < 9}
                className={`${airspaceList?.length < 9 ? "cursor-not-allowed" : "cursor-pointer"} p-1 border rounded-lg border-gray-200`}
              >
                <RxCaretRight />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioListMobile;
