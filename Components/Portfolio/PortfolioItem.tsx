import React, { useState } from "react";
import { ChevronRightIcon, DocumentApprovedIcon, DocumentRejectedIcon, LocationPointIcon, ReviewVerificationIcon } from "../Icons";
import UploadedDocuments from "./UploadedDocuments";
import VerificationSuccessPopup from "./VerificationSuccessPopup";
import AdditionalDocuments from "./AdditionalDocuments";
import { RequestDocumentStatus } from "@/types";
import { checkDocumentStatus } from "@/utils/propertyUtils/fileUpload";
import CancelClaimModal from "./CancelClaimModal";

const PortfolioItem = ({ airspaceName, tags, type, selectAirspace,setUploadedDoc, selectedAirspace,  requestDocument }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [underReview, setUnderReview] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  }
const handleAirspace = () => {
  selectAirspace()
  setShowCancelModal(true)
}
  const documentStatus = checkDocumentStatus(requestDocument);
  return (
    <div
      className="p-[11px] items-center justify-between gap-[10px] rounded-lg bg-white cursor-pointer"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div
        className="flex items-center justify-between gap-[10px]  cursor-pointer" >
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
            <div onClick={selectAirspace} className="bg-[#DBDBDB] text-[#222222] text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
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

         <div onClick={handleAirspace} className="bg-[#4285F4] text-white text-sm font-normal px-[7px] cursor-pointer rounded-[3px]">
            Cancel Claim
          </div>

           {showCancelModal && (
             <CancelClaimModal selectAirspace={selectAirspace} airspace={selectedAirspace} setShowCancelModal={setShowCancelModal}/>
           )}


          {(documentStatus === 'NOT_SUBMITTED' && !underReview) &&
            (<div onClick={handleButtonClick} className="p-2 border border-orange-500 rounded-md">
              <p className="text-orange-500 font-normal text-sm">
                Additional documents requested
              </p>
            </div>
            )}
          {((documentStatus === 'SUBMITTED') || (underReview)) && (
            <div className="flex justify-center items-center gap-2">
              <div className="w-6 h-6">
                <ReviewVerificationIcon />
              </div>
              <p className="text-orange-500 font-normal text-sm">
                Documents under review
              </p>
            </div>
          )}
          {(documentStatus === 'APPROVED' && !underReview) &&(
            <div className="flex justify-center items-center gap-2">
              <div className="w-6 h-6">
                <DocumentApprovedIcon />
              </div>
              <p className="text-[#1FD387] font-normal text-sm">
                Documents approved
              </p>
            </div>
          )}
          {((documentStatus === 'REJECTED' || documentStatus === 'RE_UPLOAD') &&   !underReview )&& (
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center w-full">
                <div className="w-4 h-4 mr-[10px]">
                  <DocumentRejectedIcon />
                </div>
                <p className="text-[#E04F64] font-normal text-sm">
                  Documents rejected
                </p>
              </div>
              {
                documentStatus === 'RE_UPLOAD' && 
                <button onClick={handleButtonClick} className="flex items-center rounded-[3px] border-[1px] text-[12px] leading-[26px] font border-[#F79663] px-[7px] ml-[10px] text-[#F79663]"><pre>Re-upload</pre></button>
              }
            </div>
          )}
          <div className="w-[7px] h-[14px]">
            <ChevronRightIcon />
          </div>
        </div>
       
      </div>

      {(documentStatus ==='SUBMITTED' || underReview) && <UploadedDocuments requestDocument={requestDocument} />}
      {showPopup && !underReview && (
        <AdditionalDocuments setUnderReview={setUnderReview} showPopup={showPopup} setUploadedDoc={setUploadedDoc} setShowSuccessToast={setShowSuccessToast} closePopup={closePopup} requestDocument={requestDocument[requestDocument?.length -1]} />
      )}

      {showSuccessToast && <VerificationSuccessPopup />}
    </div>
  );
};

export default PortfolioItem;
