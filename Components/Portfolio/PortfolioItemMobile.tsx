import React, { useState } from "react";
import {
  ChevronRightIcon,
  DocumentApprovedIcon,
  DocumentRejectedIcon,
  LocationPointIcon,
  ReviewVerificationIcon,
} from "../Icons";
import AdditionalDocuments from "./AdditionalDocuments";
import VerificationSuccessPopup from "./VerificationSuccessPopup";
import UploadedDocuments from "./UploadedDocuments";
import { PropertyData, RequestDocument } from "@/types";
import { checkDocumentStatus } from "@/utils/propertyUtils/fileUpload";
import { PortfolioTabEnum } from "@/hooks/usePortfolioList";
import Modal from "./Modal";
import CancelClaimModal from "./CancelClaimModal";

interface PropsI {
  airspaceName: string;
  activeTab: PortfolioTabEnum;
  tags: Boolean[];
  type: string | undefined;
  selectAirspace: () => void;
  setUploadedDoc: any;
  refetchAirspaceRef: React.MutableRefObject<boolean>;
  modalRef: React.MutableRefObject<boolean>;
  onCloseModal: () => void;
  setAirspaceList: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  selectedAirspace: any;
  requestDocument: RequestDocument[] | undefined;
  setSelectedAirspace: any;
  createdAt: Date;
}
function formatDate(isoDateStr) {
  const date = new Date(isoDateStr);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1);
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

const PortfolioItemMobile = ({
  refetchAirspaceRef,
  airspaceName,
  tags,
  type,
  selectAirspace,
  setUploadedDoc,
  activeTab,
  modalRef,
  onCloseModal,
  setAirspaceList,
  selectedAirspace,
  requestDocument,
  setSelectedAirspace,
  createdAt,
}: PropsI) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [underReview, setUnderReview] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleCancelClaim = () => {
    selectAirspace();
    setShowCancelModal(true);
    refetchAirspaceRef.current = true;
    modalRef.current = true;
  };
  const handleOnClaim = () => {
    selectAirspace();
    modalRef.current = false;
    setShowModal(true);
  };
  const documentStatus = checkDocumentStatus(requestDocument);
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div>
      {showModal && <Modal airspace={selectedAirspace} onCloseModal={() => {onCloseModal(); setShowModal(false)}} />}
      {showCancelModal && (
        <CancelClaimModal
          airspace={selectedAirspace}
          setShowCancelModal={setShowCancelModal}
          setSelectedAirspace={setSelectedAirspace}
          setAirspaceList={setAirspaceList}
        />
      )}
      <div>
        <div className="w-screen cursor-pointer items-center justify-between gap-[10px] rounded-lg bg-white px-4 py-6 shadow-md">
          <div className="items-center justify-between gap-[10px] rounded-lg">
            <div className="flex flex-1 items-center gap-[10px]">
              <div className="h-6 w-6">
                <LocationPointIcon />
              </div>
              <p className="flex-1 text-[14px] font-normal text-[#222222]">
                {airspaceName.length > 15 ? airspaceName.slice(0, 25) + " ..." : airspaceName}
              </p>
            </div>
            <div className="">
              <div className="mt-2 flex w-full items-center justify-between gap-[10px]">
                {!!tags[0] && (
                  <div
                    onClick={handleOnClaim}
                    className="flex h-[27px] cursor-pointer items-center justify-center rounded-[3px] bg-[#DBDBDB] p-2 text-sm font-normal text-[#222222]"
                  >
                    {type === "land" ? `Claim Date: ${formatDate(createdAt)}` : "On Rent"}
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
                    onClick={handleCancelClaim}
                    className="flex h-8 w-28 cursor-pointer items-center justify-center rounded-[3px] bg-[#4285F4] px-2 text-sm font-normal text-white"
                  >
                    Cancel Claim
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
                  <div className="">
                    <div className="flex items-center justify-end">
                      <div className="mr-[10px] h-4 w-4">
                        <DocumentRejectedIcon />
                      </div>
                      <p className="text-sm font-normal text-[#E04F64]">Documents rejected</p>
                    </div>
                    <div className="h-[14px] w-[7px]">
                      <ChevronRightIcon />
                    </div>
                  </div>
                )}
              </div>
              {
                <div>
                  {documentStatus === "RE_UPLOAD" && !underReview && (
                    <button
                      onClick={handleButtonClick}
                      className="font mt-4 flex items-center rounded-[3px] border-[1px] border-[#F79663] px-[7px] text-[12px] leading-[26px] text-[#F79663]"
                    >
                      <pre>Re-updload</pre>
                    </button>
                  )}
                </div>
              }

              {documentStatus === "NOT_SUBMITTED" && !underReview && requestDocument && (
                <div className="mt-4 flex w-full items-center justify-between gap-12">
                  <div onClick={handleButtonClick} className="rounded-md border border-orange-500 p-2">
                    <p className="text-sm font-normal text-orange-500">Additional documents requested</p>
                  </div>
                  <div className="h-[14px] w-[7px]">
                    <ChevronRightIcon />
                  </div>
                </div>
              )}

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
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemMobile;
