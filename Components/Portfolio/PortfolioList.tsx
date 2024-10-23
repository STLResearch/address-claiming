import React, { useEffect, useState } from "react";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import PortfolioItem from "./PortfolioItem";
import Spinner from "../Spinner";
import AirspacesEmptyMessage from "./AirspacesEmptyMessage";
import usePortfolioList, { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Modal from "../Portfolio/Modal";
import { AirspaceItem, PropertyData, StatusTypes } from "@/types";
import CancelClaimModal from "./CancelClaimModal";
import { Pagination } from "antd";
import { HistoryArrowIcon } from "../Icons";

interface PropsI {
  title: string;
  selectAirspace: (data: PropertyData) => void;
  selectedAirspace: PropertyData | null;
  onCloseModal: () => void;
  setUploadedDoc: any;
  uploadedDoc: any;
  setSelectedAirspace: any;
}

const PortfolioList = ({
  title,
  selectAirspace,
  selectedAirspace,
  onCloseModal,
  setUploadedDoc,
  uploadedDoc,
  setSelectedAirspace,
}: PropsI) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [uniqueAirspaceList, setUniqueAirspaceList] = useState<PropertyData[]>();
  const {
    handleTabSwitch,
    handlePrevPage,
    handleNextPage,
    loading,
    airspaceList,
    pageNumber,
    activeTab,
    setAirspaceList,
  } = usePortfolioList();

  function getUniqueItemsByAssetId(items: PropertyData[]) {
    const uniqueItemsMap = new Map<string, PropertyData>();

    items.forEach((item) => {
      //@ts-ignore
      uniqueItemsMap.set(item?.auction?.assetId, item);
    });

    return Array.from(uniqueItemsMap.values());
  }

  useEffect(() => {
    if (user && user.KYCStatusId === StatusTypes.NotAttempted) {
      setShowPopup(true);
    }
  }, [user?.KYCStatusId]);

  useEffect(() => {
    if (airspaceList.length > 0) {
      const uniqueList = getUniqueItemsByAssetId(airspaceList);
      setUniqueAirspaceList(uniqueList);
    }
  }, [airspaceList]);

  const customItemRender = (current, type, originalElement) => {
    if (airspaceList.length <= 10) return;
    if (type === "next") {
      return (
        <button className="flex items-center gap-4 text-gray-700">
          next
          <HistoryArrowIcon />
        </button>
      );
    }
    if (type === "page") {
      return (
        <button
          className={`${
            current === originalElement.props.children ? "bg-[#5D7285] text-white" : "text-gray-700"
          } rounded-full px-4 py-1`}
        >
          {originalElement.props.children}
        </button>
      );
    }
    return originalElement;
  };
  return (
    <>
      {selectedAirspace !== null && <Modal airspace={selectedAirspace} onCloseModal={onCloseModal} />}

      {showCancelModal && (
        <CancelClaimModal
          airspace={selectedAirspace}
          setShowCancelModal={setShowCancelModal}
          setSelectedAirspace={setSelectedAirspace}
          setAirspaceList={setAirspaceList}
        />
      )}
      <div
        className="flex min-w-[516px] flex-1 flex-col gap-[43px] rounded-[30px] bg-white px-[29px] py-[43px]"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <h2 className="text-center text-xl font-medium text-[#222222]">My Air Rights</h2>
        <div className="flex w-full items-center justify-between gap-2 overflow-x-auto">
          <div
            className={`${activeTab === PortfolioTabEnum.VERIFIED ? "border-b-4 border-[#6CA1F7]" : ""} cursor-pointer whitespace-nowrap px-4 py-2 transition delay-75 ease-linear`}
            onClick={() => handleTabSwitch(PortfolioTabEnum.VERIFIED)}
          >
            Verified
          </div>
          <div
            className={`${activeTab === PortfolioTabEnum.RENTED ? "border-b-4 border-[#6CA1F7]" : ""} cursor-pointer whitespace-nowrap px-4 py-2 transition delay-75 ease-linear`}
            onClick={() => handleTabSwitch(PortfolioTabEnum.RENTED)}
          >
            Rented
          </div>
          <div className="flex gap-10">
            <div
              className={`${activeTab === PortfolioTabEnum.PENDING_RENTAL ? "border-b-4 border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} cursor-pointer whitespace-nowrap px-4 py-2 text-base font-bold transition delay-75 ease-linear`}
              onClick={() => handleTabSwitch(PortfolioTabEnum.PENDING_RENTAL)}
            >
              Pending Rented
            </div>
            <div
              className={`${activeTab === PortfolioTabEnum.UNVERIFIED ? "border-b-4 border-[#6CA1F7] text-[#232F4A]" : "text-[#5D7285]"} cursor-pointer whitespace-nowrap px-4 py-2 text-base font-bold transition delay-75 ease-linear`}
              onClick={() => handleTabSwitch(PortfolioTabEnum.UNVERIFIED)}
            >
              Pending Verification
            </div>
          </div>

          <div
            className={`${activeTab === PortfolioTabEnum.BIDS ? "border-b-4 border-[#6CA1F7]" : ""} cursor-pointer whitespace-nowrap px-4 py-2 transition delay-75 ease-linear`}
            onClick={() => handleTabSwitch(PortfolioTabEnum.BIDS)}
          >
            Bids and Offers
          </div>

          <div
            className={`${activeTab === PortfolioTabEnum.REJECTED ? "border-b-4 border-[#6CA1F7]" : ""} cursor-pointer whitespace-nowrap px-4 py-2 transition delay-75 ease-linear`}
            onClick={() => handleTabSwitch(PortfolioTabEnum.REJECTED)}
          >
            Rejected
          </div>
        </div>
        {loading ?
          <div>
            {" "}
            <Spinner />
          </div>
        : <>
            <div className="flex min-h-[20rem] flex-col gap-[15px]">
              {activeTab === PortfolioTabEnum.UNVERIFIED && showPopup && (
                <div
                  className="flex w-full gap-[15px] rounded-[30px] bg-white"
                  style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
                >
                  <div className="flex flex-col items-center justify-center gap-4 p-6 md:w-[50%] md:gap-6">
                    <h1 className="text-center text-xl font-medium text-[#222222]">🚀 Attention Air Rights Owner!</h1>
                    <h1 className="block text-xl font-medium text-[#222222] md:hidden">Account verification</h1>
                    <p className="text-center text-sm font-normal leading-6 text-[#838187]">
                      Your air rights awaits verification by our operation team. Your account is not verified. We verify
                      the identity of our customers to assess potential risks, prevent fraud, and comply with legal and
                      regulatory requirements. Complete your KYC to expedite the process and ensure swift approval.
                      Plus,
                      <span className="text-sm font-bold text-[#87878D]"> earn 10 SKY points </span> as a token of our
                      appreciation! Don&apos;t delay - verify now and unlock the full potential of your air rights!
                    </p>

                    <button
                      onClick={() => router.push("/my-account")}
                      className="w-full rounded bg-blue-500 px-6 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                      Verify my identity Now
                    </button>
                  </div>
                  <div className="hidden md:block md:w-[50%]">
                    <img
                      src="/images/portfolio.png"
                      alt="Verification Image"
                      className="h-full w-full rounded-r-[30px] object-cover"
                    />
                  </div>
                </div>
              )}
              {airspaceList && airspaceList[0] ?
                (activeTab === PortfolioTabEnum.BIDS ? uniqueAirspaceList : airspaceList)?.map((airspace, index) => (
                  <PortfolioItem
                    airspace={airspace}
                    key={index}
                    requestDocument={airspace?.requestDocument}
                    selectAirspace={() => selectAirspace(airspace)}
                    setUploadedDoc={setUploadedDoc}
                  />
                ))
              : <AirspacesEmptyMessage />}
            </div>

            <div className="flex w-full flex-col text-gray-600">
              <Pagination align="center" defaultCurrent={1} itemRender={customItemRender} />
            </div>
          </>
        }
      </div>
    </>
  );
};
export default PortfolioList;
