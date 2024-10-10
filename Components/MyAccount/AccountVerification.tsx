import React, { FC, useMemo, useState } from "react";
import { FailedVerificationIcon, ReviewVerificationIcon, VerificationIcon } from "../Icons";
import AdditionalDocuments from "./AdditionalDocuments";
import VerificationSuccessPopup from "./VerificationSuccessPopup";
import PreviousUploadedDocuments from "./PreviousUploadedDocuments";
import useAuth from "@/hooks/useAuth";
import { RequestDocumentStatus, StatusTypes } from "@/types";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
interface AccountVerificationProps {
  KYCStatusId: number;
  isLoading: boolean;
  onVerifyMyAccount: () => void;
}
const AccountVerification = ({ KYCStatusId, isLoading, onVerifyMyAccount }: AccountVerificationProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAdditionalDoc, setShowAdditionalDoc] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<File[]>([]);
  const { user } = useAuth();
  const [showUnderReviewDoc, setShowUnderReviewDoc] = useState(false);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const requestedDoc = useMemo(() => {
    return user?.requestDocument?.find((doc) => doc.status === RequestDocumentStatus.NOT_SUBMITTED) || null;
  }, [user]);

  if (typeof KYCStatusId === "undefined") return <></>;

  return (
    <div>
      {KYCStatusId === StatusTypes.NotAttempted && (
        <div
          className="flex w-full gap-[15px] rounded-[30px] bg-white"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex flex-col items-center justify-center gap-4 p-6 md:w-[50%] md:gap-6">
            <h1 className="text-center text-xl font-medium text-[#222222]">🚀 Attention Airspace Owner!</h1>
            <h1 className="block text-xl font-medium text-[#222222] md:hidden">Account verification</h1>
            <p className="text-center text-sm font-normal leading-6 text-[#838187]">
              Your account is not verified. We verify the identity of our customers to assess potential risks, prevent
              fraud, and comply with legal and regulatory requirements. Complete your KYC to expedite the process and
              ensure swift approval. Plus,
              <span className="text-sm font-bold text-[#87878D]"> earn 10 SKY points </span> as a token of our
              appreciation! Don&apos;t delay - verify now and unlock the full potential of your airspace!
            </p>
            <button
              onClick={onVerifyMyAccount}
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

      {KYCStatusId === StatusTypes.Completed && (
        <div
          className="flex flex-col gap-[15px] rounded-[30px] bg-white px-[20px] py-[17px] md:px-[25px]"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#222222]">Account verification</h2>
            <div className="">
              <ReviewVerificationIcon />
            </div>
          </div>

          <div>
            {!requestedDoc || showUnderReviewDoc ?
              <div>
                <p className="mt-2 text-base font-normal text-[#87878D]">
                  Your account verification is currently under review. This step is crucial for security and compliance
                  reasons. Please await confirmation to enjoy full access to our services. Rest assured, your data is
                  securely handled. If you have any questions, feel free to contact our support team. Thank you for your
                  patience.
                </p>
                <p className="mt-2 text-base font-bold text-[#87878D]">
                  Once your KYC verification is successfully completed, you&apos;ll instantly earn 10 SKY points.
                </p>
              </div>
            : <div>
                <div>
                  <p className="mt-2 text-base font-normal text-[#87878D]">
                    Your account verification is currently under review.
                    <span className="font-bold">
                      {" "}
                      To complete this process, we require additional documentation.
                    </span>{" "}
                    This step is crucial for security and compliance reasons.
                  </p>
                  <p className="mt-2 text-base font-normal text-[#87878D]">
                    Please <span className="font-bold">submit {formatTextToReadable(requestedDoc?.description)} </span>
                    at your earliest convenience to enjoy full access to our services. Rest assured, your data is
                    securely handled. If you have any questions, feel free to contact our support team. Thank you for
                    your cooperation and patience
                  </p>

                  <div className="mt-2 flex justify-end">
                    <button onClick={handleButtonClick} className="text-base text-dark-blue">
                      Add Additional Documents
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      )}

      {KYCStatusId === StatusTypes.Approved && (
        <div
          className="flex flex-col gap-[15px] rounded-[30px] bg-white px-[20px] py-[17px] md:px-[25px]"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#222222]">Account verification</h2>
            <div>
              <VerificationIcon />
            </div>
          </div>
          <p className="text-base font-normal text-[#87878D]">
            Thank you, your account is successfully verified. We verify the identity of our customers to assess
            potential risks, prevent fraud, and comply with legal and regulatory requirements. Note that we store your
            data securely with advanced encryption and strict authentication measures to ensure utmost privacy and
            protection.
          </p>
          <h1 className="text-base font-bold text-[#87878D]">
            You&apos;ve instantly earned 10 SKY points. Check your SKY points balance on the referrral page.
          </h1>
        </div>
      )}

      {KYCStatusId === StatusTypes.Failed && (
        <div
          className="flex flex-col gap-[15px] rounded-[30px] bg-white px-[20px] py-[17px] md:px-[25px]"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#222222]">Account verification</h2>
            <div>
              <FailedVerificationIcon />
            </div>
          </div>
          <p className="text-base font-normal text-[#87878D]">
            We regret to inform you that your recent account verification attempt was unsuccessful. To access our
            services fully, please attempt verification again. Reach out to our support team for assistance. Thank you
            for your understanding.
          </p>
          <button
            className="flex-1 cursor-pointer text-right text-base font-medium text-[#0653EA]"
            disabled={isLoading}
            onClick={onVerifyMyAccount}
          >
            Verify my account
          </button>
        </div>
      )}
      <PreviousUploadedDocuments />
      {showPopup && (
        <AdditionalDocuments
          setShowUnderReviewDoc={setShowUnderReviewDoc}
          setUploadedDoc={setUploadedDoc}
          showPopup={showPopup}
          closePopup={closePopup}
          setShowAdditionalDoc={setShowAdditionalDoc}
          setShowSuccessToast={setShowSuccessToast}
        />
      )}
      {showSuccessToast && <VerificationSuccessPopup />}
    </div>
  );
};
export default AccountVerification;
