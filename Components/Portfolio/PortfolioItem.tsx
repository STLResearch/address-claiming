import React, { useState } from "react";
import {
  ChevronRightIcon,
  DocumentApprovedIcon,
  DocumentRejectedIcon,
  LocationPointIcon,
  ReviewVerificationIcon,
} from "../Icons";
import UploadedDocuments from "./UploadedDocuments";
import VerificationSuccessPopup from "./VerificationSuccessPopup";
import AdditionalDocuments from "./AdditionalDocuments";
import { PropertyData, RequestDocument } from "@/types";
import { checkDocumentStatus } from "@/utils/propertyUtils/fileUpload";
import { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import Modal from "./Modal";

interface PropsI {
  airspaceName: string;
  activeTab: PortfolioTabEnum;
  tags: Boolean[];
  type: string | undefined;
  requestDocument: RequestDocument[] | undefined;
  selectAirspace: () => void;
  setUploadedDoc: any;
  refetchAirspaceRef: React.MutableRefObject<boolean>;
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
  setAirspaceList: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  selectedAirspace: any;
}

const PortfolioItem = ({
  setShowCancelModal,
  airspaceName,
  refetchAirspaceRef,
  tags,
  type,
  selectAirspace,
  setUploadedDoc,
  requestDocument,
  activeTab,
  onCloseModal,
  setAirspaceList,
  selectedAirspace,
}: PropsI) => {
  const [showPopup, setShowPopup] = useState(false);
  const [underReview, setUnderReview] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showModel, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const handleAirspace = () => {
    selectAirspace();
    setShowCancelModal(true);
    refetchAirspaceRef.current = true;
  };
  const handleOnClaim = () => {
    selectAirspace();
    setShowModal(true);
  };
  const documentStatus = checkDocumentStatus(requestDocument);
  return (
    <div>
      {showModel && (
        <Modal
          airspace={selectedAirspace}
          onCloseModal={onCloseModal}
          setAirspaceList={setAirspaceList}
          requestDocument={requestDocument || []}
          setShowModal={setShowModal}
        />
      )}
      <div
        className="cursor-pointer items-center justify-between gap-[10px] rounded-lg bg-white p-[11px]"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="flex cursor-pointer items-center justify-between gap-[10px]">
          <div className="flex flex-1 items-center gap-[10px]">
            <div className="h-6 w-6">
              <LocationPointIcon />
            </div>
            <p className="flex-1 text-[14px] font-normal text-[#222222]">{airspaceName}</p>
          </div>
          <div className="flex items-center gap-[10px]">
            {!!tags[0] && (
              <div
                onClick={handleOnClaim}
                className="cursor-pointer rounded-[3px] bg-[#DBDBDB] px-[7px] text-sm font-normal text-[#222222]"
              >
                {type === "land" ? "On Claim" : "On Rent"}
              </div>
            )}
            {!!tags[1] && (
              <div className="cursor-pointer rounded-[3px] bg-[#E7E6E6] px-[7px] text-sm font-normal text-[#222222]">
                On Sale
              </div>
            )}
            {!!tags[2] && (
              <div className="cursor-pointer rounded-[3px] bg-[#222222] px-[7px] text-sm font-normal text-white">
                No Fly Zone
              </div>
            )}
            {!!tags[3] && (
              <div className="cursor-pointer rounded-[3px] bg-[#E04F64] px-[7px] text-sm font-normal text-white">
                Review Offer
              </div>
            )}

            {activeTab === PortfolioTabEnum.UNVERIFIED && (
              <div
                onClick={handleAirspace}
                className="cursor-pointer rounded-[3px] bg-[#4285F4] px-[7px] text-sm font-normal text-white"
              >
                Cancel Claim
              </div>
            )}

            {documentStatus === "NOT_SUBMITTED" && !underReview && (
              <div onClick={handleButtonClick} className="rounded-md border border-orange-500 p-2">
                <p className="text-sm font-normal text-orange-500">Additional documents requested</p>
              </div>
            )}
            {(documentStatus === "SUBMITTED" || underReview) && (
              <div className="flex items-center justify-center gap-2">
                <div className="h-6 w-6">
                  <ReviewVerificationIcon />
                </div>
                <p className="text-sm font-normal text-orange-500">Documents under review</p>
              </div>
            )}
            {documentStatus === "APPROVED" && !underReview && (
              <div className="flex items-center justify-center gap-2">
                <div className="h-6 w-6">
                  <DocumentApprovedIcon />
                </div>
                <p className="text-sm font-normal text-[#1FD387]">Documents approved</p>
              </div>
            )}
            {(documentStatus === "REJECTED" || documentStatus === "RE_UPLOAD") && !underReview && (
              <div className="flex items-center justify-center">
                <div className="flex w-full items-center justify-center">
                  <div className="mr-[10px] h-4 w-4">
                    <DocumentRejectedIcon />
                  </div>
                  <p className="text-sm font-normal text-[#E04F64]">Documents rejected</p>
                </div>
                {documentStatus === "RE_UPLOAD" && (
                  <button
                    onClick={handleButtonClick}
                    className="font ml-[10px] flex items-center rounded-[3px] border-[1px] border-[#F79663] px-[7px] text-[12px] leading-[26px] text-[#F79663]"
                  >
                    <pre>Re-upload</pre>
                  </button>
                )}
              </div>
            )}
            <div className="h-[14px] w-[7px]">
              <ChevronRightIcon />
            </div>
          </div>
        </div>

        {(documentStatus === "SUBMITTED" || underReview) && requestDocument && (
          <UploadedDocuments requestDocument={requestDocument} />
        )}
        {showPopup && !underReview && requestDocument && (
          <AdditionalDocuments
            setUnderReview={setUnderReview}
            showPopup={showPopup}
            setUploadedDoc={setUploadedDoc}
            setShowSuccessToast={setShowSuccessToast}
            closePopup={closePopup}
            requestDocument={requestDocument[requestDocument?.length - 1]}
          />
        )}

        {showSuccessToast && <VerificationSuccessPopup />}
      </div>
    </div>
  );
};

export default PortfolioItem;
