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
import LoadingButton from "../LoadingButton/LoadingButton";

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
  createdAt: Date
}

function formatDate(isoDateStr) {
  const date = new Date(isoDateStr);
  const day = String(date.getUTCDate()).padStart(2, '0');   // Day (with leading zero if needed)
  const month = String(date.getUTCMonth() + 1);             // Month (0-indexed, so +1)
  const year = date.getUTCFullYear();                       // Year

  return `${day}/${month}/${year}`;
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
  createdAt
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
        className="p-[11px] items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer h-[49px]"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="flex items-center justify-between gap-[10px]  cursor-pointer">
          <div className="flex items-center gap-[10px] flex-1">
            <div className="w-6 h-6">
              <LocationPointIcon />
            </div>
            <p className="font-normal text-[#222222] text-[14px] flex-1">
              {airspaceName}
            </p>
          </div>
          <div className="flex gap-[10px] items-center">
            {!!tags[0] && (
              <LoadingButton
                onClick={handleOnClaim}
                isLoading={false}
                color={""}
                className="bg-[#DBDBDB] text-[#222222] text-[11.89px] font-normal px-[7px] cursor-pointer rounded-[3px] h-[27px]"
                disable={false}
              >
                {type === "land" ? `Claim Date: ${formatDate(createdAt)}` : "On Rent"}
              </LoadingButton>
            )}
            {!!tags[1] && (
              <LoadingButton
                onClick={""}
                isLoading={false}
                color={""}
                disable={false}
                className="bg-[#E7E6E6] text-[#222222] text-[11.89px] font-normal px-[7px] cursor-pointer rounded-[3px] h-[27px]"
              >
                On Sale
              </LoadingButton>
            )}
            {!!tags[2] && (
              <LoadingButton
                onClick={""}
                isLoading={false}
                color={""}
                disable={false}
                className="bg-[#222222] text-white text-[11.89px] font-normal px-[7px] cursor-pointer rounded-[3px] h-[27px]"
              >
                No Fly Zone
              </LoadingButton>
            )}
            {!!tags[3] && (
              <LoadingButton
                onClick={""}
                isLoading={false}
                color={""}
                disable={false}
                className="bg-[#E04F64] text-white text-[11.89px] font-normal px-[7px] cursor-pointer rounded-[3px] h-[27px]"
              >
                Review Offer
              </LoadingButton>
            )}

            {activeTab === PortfolioTabEnum.UNVERIFIED && (
              <LoadingButton
                onClick={handleAirspace}
                isLoading={false}
                color={""}
                disable={false}
                className="bg-[#4285F4] text-white text-[11.89px] font-normal px-[7px] cursor-pointer rounded-[3px] h-[27px]"
              >
                Cancel Claim
              </LoadingButton>
            )}

            {documentStatus === "NOT_SUBMITTED" && !underReview && (
              <div
                onClick={handleButtonClick}
                className="p-2 border border-orange-500 rounded-md"
              >
                <p className="text-orange-500 font-normal text-sm">
                  Additional documents requested
                </p>
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
                <div className="flex justify-center items-center">
                  <div className="flex justify-center items-center w-full">
                    <div className="w-4 h-4 mr-[10px]">
                      <DocumentRejectedIcon />
                    </div>
                    <p className="text-[#E04F64] font-normal text-sm">
                      Documents rejected
                    </p>
                  </div>
                  {documentStatus === "RE_UPLOAD" && (
                    <button
                      onClick={handleButtonClick}
                      className="flex items-center rounded-[3px] border-[1px] text-[12px] leading-[26px] font border-[#F79663] px-[7px] ml-[10px] text-[#F79663]"
                    >
                      <pre>Re-upload</pre>
                    </button>
                  )}
                </div>
              )}
            <div className="w-[7px] h-[14px]">
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
