import React, { useState } from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Spinner from "../Spinner";
import PortfolioItemMobile from "./PortfolioItemMobile";
import AirspacesEmptyMessage from "./AirspacesEmptyMessage";
import usePortfolioList, { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import { PropertyData } from "@/types";
import CancelClaimModal from "./CancelClaimModal";

interface PropsI {
  selectAirspace: (data: PropertyData) => void;
  setUploadedDoc: any;
  uploadedDoc: any;
  selectedAirspace:any;
  setSelectedAirspace:any;
}


const PortfolioListMobile = ({setSelectedAirspace, selectAirspace, setUploadedDoc, selectedAirspace,uploadedDoc }: PropsI) => {
  const [showCancelModal, setShowCancelModal] = useState(false)
  
  const {
    handleTabSwitch,
    handlePrevPage,
    handleNextPage,
    loading,
    airspaceList,
    pageNumber,
    activeTab,
    setAirspaceList,
    refetchAirspaceRef
  } = usePortfolioList();
  return (
<>
    {showCancelModal && (
      <CancelClaimModal airspace={selectedAirspace} setShowCancelModal={setShowCancelModal} setSelectedAirspace={setSelectedAirspace} setAirspaceList={setAirspaceList}  />
    )}
    <div className="overflow-x-hidden mb-24">
      <div
        className="flex items-center overflow-x-scroll border-b border-[#5D7285]/50 gap-12"
        style={{ scrollbarWidth: "none", scrollbarColor: "none" }}
      >
        <div
          className={`${activeTab === PortfolioTabEnum.VERIFIED ? "border-b-4  border-[#6CA1F7] text-[#232F4A] " : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.VERIFIED)}
        >
          Verified Airspaces
        </div>
        <div
          className={`${activeTab === PortfolioTabEnum.RENTED ? "border-b-4  border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.RENTED)}
        >
          Rented Airspaces
        </div>
        <div
          className={`${activeTab === PortfolioTabEnum.PENDING_RENTAL ? "border-b-4  border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.PENDING_RENTAL)}
        >
          Pending Rented Airspaces
        </div>
        <div className={`${activeTab === PortfolioTabEnum.UNVERIFIED ? "border-b-4 border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold flex`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.UNVERIFIED)}
        >
          <span className="flex-1">Pending Verification</span>

          <div className="relative w-[24px] h-[24px] ml-2">
            {/* <div className="absolute inset-0 bg-[#F79663] text-white text-xs flex items-center justify-center rounded-md">
              1
            </div> */}
          </div>
        </div>

        <div
          className={`${activeTab === PortfolioTabEnum.REJECTED ? "border-b-4  border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
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
              airspaceList.map((airspace, index) => (
                <PortfolioItemMobile
                airspaceName={airspace?.address}
                key={index}
                tags={[true, false, false, false]}
                type={airspace?.type}
                requestDocument={airspace?.requestDocument}
                selectAirspace={() => selectAirspace(airspace)}
                setUploadedDoc={setUploadedDoc}
                setShowCancelModal={setShowCancelModal} 
                  refetchAirspaceRef={refetchAirspaceRef}  
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
    </>
  );
};
export default PortfolioListMobile;