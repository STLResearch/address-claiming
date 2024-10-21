/* eslint-disable no-magic-numbers */
import React, { useEffect, useRef, useState } from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Spinner from "../Spinner";
import PortfolioItemMobile from "./PortfolioItemMobile";
import AirspacesEmptyMessage from "./AirspacesEmptyMessage";
import usePortfolioList, { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PropertyData, StatusTypes } from "@/types";
import { Pagination } from "antd";
import { HistoryArrowIcon } from "../Icons";

interface PropsI {
  selectAirspace: (data: PropertyData) => void;
  selectedAirspace: any;
  onCloseModal: () => void;
  setUploadedDoc: any;
  uploadedDoc: any;
  setSelectedAirspace: any;
}

const PortfolioListMobile = ({
  selectAirspace,
  setUploadedDoc,
  selectedAirspace,
  onCloseModal,
  setSelectedAirspace,
}: PropsI) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.KYCStatusId === StatusTypes.NotAttempted) {
      setShowPopup(true);
    }
  }, [user?.KYCStatusId]);

  const modalRef = useRef(false);

  const {
    handleTabSwitch,
    handlePrevPage,
    handleNextPage,
    loading,
    airspaceList,
    pageNumber,
    activeTab,
    setAirspaceList,
    refetchAirspaceRef,
  } = usePortfolioList();
  const customItemRender = (current, type, originalElement) => {
    if(airspaceList.length <= 10) return
    if (type === "next") {
      return (
        <button className="flex items-center gap-4 text-gray-700  ">
          next
          <HistoryArrowIcon />
        </button>
      );
    }
    if (type === "page") {
      return (
        <button
          className={`${
            current === originalElement.props.children
              ? "bg-[#5D7285] text-white"
              : " text-gray-700"
          } rounded-full px-4 py-1`}
        >
          {originalElement.props.children}
        </button>
      );
    }
    return originalElement;
  };
  return (
    <div className="overflow-x-hidden mb-24">
      <div
        className="flex items-center overflow-x-scroll border-b border-[#5D7285]/50 gap-12"
        style={{ scrollbarWidth: "none", scrollbarColor: "none" }}
      >
        <div
          className={`${activeTab === PortfolioTabEnum.VERIFIED ? "border-b-4  border-[#6CA1F7] text-[#232F4A] " : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.VERIFIED)}
        >
          Verified Air Rights
        </div>
        <div
          className={`${activeTab === PortfolioTabEnum.RENTED ? "border-b-4  border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.RENTED)}
        >
          Rented Air Rights
        </div>
        <div
          className={`${activeTab === PortfolioTabEnum.PENDING_RENTAL ? "border-b-4  border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold`}
          onClick={() => handleTabSwitch(PortfolioTabEnum.PENDING_RENTAL)}
        >
          Pending Rented Air Rights
        </div>
        <div
          className={`${activeTab === PortfolioTabEnum.UNVERIFIED ? "border-b-4 border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} px-6 py-2.5 cursor-pointer transition ease-linear delay-75 whitespace-nowrap text-base font-bold flex`}
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
            Rejected Air Rights
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
              {activeTab === PortfolioTabEnum.UNVERIFIED && showPopup && (
                <div
                  className="flex w-full rounded-[30px] gap-[15px] bg-white"
                  style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
                >
                  <div className="w-full p-6 flex flex-col justify-center items-center md:gap-6 gap-4">
                    <h1 className="text-xl font-medium text-[#222222]  text-center">
                      🚀 Attention Air Right Owner!
                    </h1>
                    <h1 className="text-xl font-medium text-[#222222] block md:hidden">
                      Account verification
                    </h1>
                    <p className="text-sm font-normal text-[#838187] text-center leading-6">
                      Your air rights awaits verification by our operation team.
                      Your account is not verified. We verify the identity of
                      our customers to assess potential risks, prevent fraud,
                      and comply with legal and regulatory requirements.
                      Complete your KYC to expedite the process and ensure swift
                      approval. Plus,
                      <span className="text-[#87878D] text-sm font-bold">
                        {" "}
                        earn 10 SKY points{" "}
                      </span>{" "}
                      as a token of our appreciation! Don&apos;t delay - verify
                      now and unlock the full potential of your air rights!
                    </p>

                    <button
                      onClick={() => router.push("/my-account")}
                      className="text-sm font-medium w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      Verify my identity Now
                    </button>
                  </div>
                </div>
              )}
              {airspaceList && airspaceList[0] && airspaceList[0].address ? (
                airspaceList.map((airspace, index) => (
                  <PortfolioItemMobile
                    activeTab={activeTab}
                    airspaceName={airspace?.address}
                    key={index}
                    tags={[true, false, false, false]}
                    type={airspace?.type}
                    modalRef={modalRef}
                    selectAirspace={() => selectAirspace(airspace)}
                    setUploadedDoc={setUploadedDoc}
                    refetchAirspaceRef={refetchAirspaceRef}
                    onCloseModal={onCloseModal}
                    setAirspaceList={setAirspaceList}
                    selectedAirspace={selectedAirspace}
                    requestDocument={airspace?.requestDocument}
                    setSelectedAirspace={setSelectedAirspace}  
                    createdAt={airspace.createdAt as Date}       
                      />
                ))
              ) : (
                <AirspacesEmptyMessage />
              )}
            </div>
            <div className="flex flex-col w-full text-gray-600">
            <Pagination align="center" defaultCurrent={1}  itemRender={customItemRender} />
            </div>
          </div>
        )}
      </div>
  );
};
export default PortfolioListMobile;
