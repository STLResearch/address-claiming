import React, { FC, useMemo, useState } from "react";
import {
  FailedVerificationIcon,
  ReviewVerificationIcon,
  VerificationIcon,
} from "../Icons";
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
const AccountVerification = ({
  KYCStatusId,
  isLoading,
  onVerifyMyAccount,
}: AccountVerificationProps) => {
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
    return (
      user?.requestDocument?.find(
        (doc) => doc.status === RequestDocumentStatus.NOT_SUBMITTED,
      ) || null
    );
  }, [user]);

  if (typeof KYCStatusId === "undefined") return <></>;

  return (
    <div>
      {KYCStatusId === StatusTypes.NotAttempted && (
        <div
          className="flex w-full rounded-[30px] gap-[15px] bg-white"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="md:w-[50%]  p-6  flex flex-col justify-center items-center md:gap-6 gap-4">
            <h1 className="text-xl font-medium text-[#222222]  text-center">
              🚀 Attention Air Rights Owner!
            </h1>
            <h1 className="text-xl font-medium text-[#222222] block md:hidden">
              Account verification
            </h1>
            <p className="text-sm font-normal text-[#838187] text-center leading-6">
              Your account is not verified. We verify the identity of our
              customers to assess potential risks, prevent fraud, and comply
              with legal and regulatory requirements. Complete your KYC to
              expedite the process and ensure swift approval. Plus,
              <span className="text-[#87878D] text-sm font-bold">
                {" "}
                earn 10 SKY points{" "}
              </span>{" "}
              as a token of our appreciation! Don&apos;t delay - verify now and
              unlock the full potential of your air rights!
            </p>
            <button
              onClick={onVerifyMyAccount}
              className="text-sm font-medium w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Verify my identity Now
            </button>
          </div>
          <div className="hidden md:block md:w-[50%]">
            <img
              src="/images/portfolio.png"
              alt="Verification Image"
              className="h-full w-full object-cover rounded-r-[30px]"
            />
          </div>
        </div>
      )}

      {KYCStatusId === StatusTypes.Completed && (
        <div
          className="flex flex-col py-[17px] md:px-[25px] px-[20px] rounded-[30px] gap-[15px] bg-white"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#222222]">
              Account verification
            </h2>
            <div className="">
              <ReviewVerificationIcon />
            </div>
          </div>

          <div>
            {!requestedDoc || showUnderReviewDoc ? (
              <div>
                <p className="font-normal text-base text-[#87878D] mt-2">
                  Your account verification is currently under review. This step
                  is crucial for security and compliance reasons. Please await
                  confirmation to enjoy full access to our services. Rest
                  assured, your data is securely handled. If you have any
                  questions, feel free to contact our support team. Thank you
                  for your patience.
                </p>
                <p className="font-bold text-base text-[#87878D] mt-2">
                  Once your KYC verification is successfully completed,
                  you&apos;ll instantly earn 10 SKY points.
                </p>
              </div>
            ) : (
              <div>
                <div>
                  <p className="font-normal text-base text-[#87878D] mt-2">
                    Your account verification is currently under review.
                    <span className="font-bold">
                      {" "}
                      To complete this process, we require additional
                      documentation.
                    </span>{" "}
                    This step is crucial for security and compliance reasons.
                  </p>
                  <p className="font-normal text-base text-[#87878D] mt-2">
                    Please{" "}
                    <span className="font-bold">
                      submit {formatTextToReadable(requestedDoc?.description)}{" "}
                    </span>
                    at your earliest convenience to enjoy full access to our
                    services. Rest assured, your data is securely handled. If
                    you have any questions, feel free to contact our support
                    team. Thank you for your cooperation and patience
                  </p>

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleButtonClick}
                      className="text-dark-blue text-base"
                    >
                      Add Additional Documents
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {KYCStatusId === StatusTypes.Approved && (
        <div
          className="flex flex-col py-[17px] md:px-[25px] px-[20px] rounded-[30px] gap-[15px] bg-white"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#222222]">
              Account verification
            </h2>
            <div>
              <VerificationIcon />
            </div>
          </div>
          <p className="font-normal text-base text-[#87878D]">
            Thank you, your account is successfully verified. We verify the
            identity of our customers to assess potential risks, prevent fraud,
            and comply with legal and regulatory requirements. Note that we
            store your data securely with advanced encryption and strict
            authentication measures to ensure utmost privacy and protection.
          </p>
          <h1 className="text-[#87878D] text-base font-bold">
            You&apos;ve instantly earned 10 SKY points. Check your SKY points
            balance on the referrral page.
          </h1>
        </div>
      )}

      {KYCStatusId === StatusTypes.Failed && (
        <div
          className="flex flex-col py-[17px] md:px-[25px] px-[20px] rounded-[30px] gap-[15px] bg-white"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-[#222222]">
              Account verification
            </h2>
            <div>
              <FailedVerificationIcon />
            </div>
          </div>
          <p className="font-normal text-base text-[#87878D]">
            We regret to inform you that your recent account verification
            attempt was unsuccessful. To access our services fully, please
            attempt verification again. Reach out to our support team for
            assistance. Thank you for your understanding.
          </p>
          <button
            className="font-medium text-base text-[#0653EA] text-right flex-1 cursor-pointer"
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
