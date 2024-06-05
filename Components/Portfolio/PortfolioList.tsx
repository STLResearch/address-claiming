import React from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import PortfolioItem from "./PortfolioItem";
import Spinner from "../Spinner";
import AirspacesEmptyMessage from "./AirspacesEmptyMessage";
import usePortfolioList, { PortfolioTabEnum } from "@/hooks/usePortfolioList";


const PortfolioList = ({ title, selectAirspace }) => {

  const { 
    highlightActiveTab, 
    handleTabSwitch, 
    handlePrevPage, 
    handleNextPage,
    loading, 
    airspaceList,
    pageNumber
  } = usePortfolioList()
  
  return (
    <div
      className="py-[43px] px-[29px] rounded-[30px] bg-white flex flex-col gap-[43px] min-w-[516px] flex-1"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <h2 className="font-medium text-xl text-[#222222] text-center">
        {title}
      </h2>
      <div className="flex items-center gap-16">
        <div
          className={highlightActiveTab(PortfolioTabEnum.VERIFIED)}
          onClick={() => handleTabSwitch(PortfolioTabEnum.VERIFIED)}
        >
          Verified Airspaces
        </div>
        <div
          className={highlightActiveTab(PortfolioTabEnum.RENTED)}
          onClick={() => handleTabSwitch(PortfolioTabEnum.RENTED)}
        >
          Rented Airspaces
        </div>
        <div
          className={highlightActiveTab(PortfolioTabEnum.UNVERIFIED)}
          onClick={() => handleTabSwitch(PortfolioTabEnum.UNVERIFIED)}
        >
          Pending Verification
        </div>
        <div
          className={highlightActiveTab(PortfolioTabEnum.REJECTED)}
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
        <>
          <div className="flex flex-col gap-[15px] min-h-[20rem]">
            {airspaceList &&
              airspaceList[0] &&
              airspaceList[0].address ? (
              airspaceList?.map((airspace, index) => (
                <PortfolioItem
                  airspaceName={airspace?.address}
                  key={index}
                  tags={[true, false, false, false]}
                  type={airspace?.type}
                  selectAirspace={() => selectAirspace(airspace)}
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
        </>
      )}
    </div>
  );
};

export default PortfolioList;
