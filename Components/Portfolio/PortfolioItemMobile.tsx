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
import { RequestDocument } from "@/types";
import { checkDocumentStatus } from "@/utils/propertyUtils/fileUpload";
import { PortfolioTabEnum } from "@/hooks/usePortfolioList";

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
}

const PortfolioItemMobile = ({
  setShowCancelModal,
  refetchAirspaceRef,
  airspaceName,
  tags,
  type,
  selectAirspace,
  setUploadedDoc,
  requestDocument,
  activeTab,
}: PropsI) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [underReview, setUnderReview] = useState<boolean>(false);

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
  const documentStatus = checkDocumentStatus(requestDocument);

  return (
    <div>
      <div className=" shadow-md px-4 py-6 items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer w-screen">
        <div className="items-center justify-between gap-[10px] rounded-lg">
          <div className="flex items-center gap-[10px] flex-1">
            <div className="w-6 h-6">
              <LocationPointIcon />
            </div>
            <p className="font-normal text-[#222222] text-[14px] flex-1">
              {airspaceName.length > 15
                ? airspaceName.slice(0, 25) + " ..."
                : airspaceName}
            </p>
          </div>
          <div className="">
            <div className="flex justify-between mt-2 gap-[10px] items-center w-full">
              {!!tags[0] && (
                <div
                  onClick={selectAirspace}
                  className="w-20 h-8 bg-[#DBDBDB] text-[#222222] text-sm font-normal p-2 cursor-pointer rounded-[3px] flex items-center justify-center"
                >
                  {type === "land" ? "On Claim" : "On Rent"}
                </div>
              )}
              {!!tags[1] && (
                <div className="bg-[#E7E6E6] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                  On Sale
                </div>
              )}
              {!!tags[2] && (
                <div className="bg-[#222222] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                  No Fly Zone
                </div>
              )}
              {!!tags[3] && (
                <div className="bg-[#E04F64] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
                  Review Offer
                </div>
              )}
              {activeTab === PortfolioTabEnum.UNVERIFIED && (
                <div
                  onClick={handleAirspace}
                  className="bg-[#4285F4] text-white text-sm font-normal px-2 cursor-pointer rounded-[3px] w-28 h-8 flex items-center justify-center"
                >
                  Cancel Claim
                </div>
              )}

              {(documentStatus === "SUBMITTED" || underReview) && (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-6 h-6">
                    <ReviewVerificationIcon />
                  </div>
                  <p className="text-orange-500 font-normal text-sm">
                    Documents under review
                  </p>
                </div>
              )}
              {documentStatus === "APPROVED" && !underReview && (
                <div className="flex justify-center items-center gap-2">
                  <div className="w-6 h-6">
                    <DocumentApprovedIcon />
                  </div>
                  <p className="text-[#1FD387] font-normal text-sm">
                    Documents approved
                  </p>
                </div>
              )}
              {(documentStatus === "REJECTED" ||
                documentStatus === "RE_UPLOAD") &&
                !underReview && (
                  <div className="">
                    <div className="flex justify-end items-center ">
                      <div className="w-4 h-4 mr-[10px]">
                        <DocumentRejectedIcon />
                      </div>
                      <p className="text-[#E04F64] font-normal text-sm">
                        Documents rejected
                      </p>
                    </div>
                  </div>
                )}
            </div>
            {
              <div>
                {documentStatus === "RE_UPLOAD" && !underReview && (
                  <button
                    onClick={handleButtonClick}
                    className="flex items-center mt-4 rounded-[3px] border-[1px] text-[12px] leading-[26px] font border-[#F79663] px-[7px] text-[#F79663]"
                  >
                    <pre>Re-updload</pre>
                  </button>
                )}
              </div>
            }

            {documentStatus === "NOT_SUBMITTED" && !underReview && (
              <div className="flex justify-between items-center gap-12 w-full mt-4">
                <div
                  onClick={handleButtonClick}
                  className="p-2 border border-orange-500 rounded-md"
                >
                  <p className="text-orange-500 font-normal text-sm">
                    Additional documents requested
                  </p>
                </div>
                <div className="w-[7px] h-[14px]">
                  <ChevronRightIcon />
                </div>
              </div>
            )}

            {(documentStatus === "SUBMITTED" || underReview) &&
              requestDocument && (
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
  );
};

export default PortfolioItemMobile;
