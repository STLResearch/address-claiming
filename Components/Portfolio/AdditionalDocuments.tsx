import React, { Dispatch, SetStateAction, useState } from "react";
import { useDropzone, DropzoneRootProps } from "react-dropzone";
import { CloseIconBlack } from "../Icons";
import { useMobile } from "@/hooks/useMobile";
import DocumentUploadServices from "@/services/DocumentUploadServices";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import { toast } from "react-toastify";
import {
  formatTextToReadable,
  isFileSizeValid,
  isValidFileType,
  uploadImage,
} from "@/utils/propertyUtils/fileUpload";
import { RequestDocument } from "@/types";
import S3UploadServices from "@/services/s3upload";

interface PopupProps {
  setUnderReview: Dispatch<SetStateAction<boolean>>;
  showPopup: boolean;
  closePopup: () => void;
  setUploadedDoc: Dispatch<SetStateAction<File[]>>;
  setShowSuccessToast: Dispatch<SetStateAction<boolean>>;
  requestDocument: RequestDocument;
}

const Popup: React.FC<PopupProps> = ({
  setUnderReview,
  showPopup,
  closePopup,
  setUploadedDoc,
  setShowSuccessToast,
  requestDocument,
}) => {
  const { isMobile } = useMobile();
  const { updateDocument } = DocumentUploadServices();
  const { generatePublicFileUploadUrl } = S3UploadServices();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => setIsChecked(!isChecked);

  const onDrop = (acceptedFiles: File[]) => {
    const isValid = acceptedFiles.every((file) => isFileSizeValid(file));

    if (isValid) {
      setSelectedFiles(acceptedFiles);
    } else {
      toast.error("File size must be less than 20MB!");
    }
  };

  const { getRootProps } = useDropzone({ onDrop, multiple: false });

  if (!showPopup) return null;

  const handleClick = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please upload a file before submitting!");
      return;
    }

    if (!isValidFileType(selectedFiles[0].name)) {
      toast.error("Invalid file type!");
      return;
    }

    setLoading(true);

    try {
      const generatedRes = await generatePublicFileUploadUrl({
        fileType: selectedFiles[0]?.type,
        requestId: requestDocument.id,
      });

      if (!generatedRes?.uploadUrl?.uploadUrl || !generatedRes?.key) {
        throw new Error("Failed to upload file ");
      }

      const imageRes = await uploadImage(generatedRes, selectedFiles[0]);
      if ((imageRes && imageRes?.data?.status !== "SUCCESS") || !imageRes) {
        throw new Error("Failed to upload file ");
      }

      const path = generatedRes.key.toString();
      const updateResponse = await updateDocument({
        path,
        requestId: Number(requestDocument.id),
      });
      if (!updateResponse) {
        throw new Error("Failed to upload file ");
      }

      setUnderReview(true);
      setUploadedDoc((prev) => [...prev, selectedFiles[0]]);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
      closePopup();
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during the upload process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="fixed bottom-0 md:relative md:top-0 flex flex-col h-[75%] md:w-[566px] md:min-h-[350px] md:py-[20px] py-[30px] md:px-[20px] px-[30px] rounded-t-[30px] md:rounded-[15px] bg-white gap-[15px] overflow-auto"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div>
          {isMobile ? (
            <div className="flex flex-col justify-center items-center">
              <div
                onClick={closePopup}
                className="border-4 border-dark-grey cursor-pointer w-[20%] rounded-md"
              ></div>
              <h2 className="mt-4 text-xl font-medium text-[#222222]">
                Documents
              </h2>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium text-[#222222]">Documents</h2>
              <button
                onClick={closePopup}
                className="flex w-4 h-4 cursor-pointer text-light-black"
              >
                <CloseIconBlack />
              </button>
            </div>
          )}
        </div>

        <p className="font-normal text-base text-[#87878D]">
          To verify your ownership of the claimed airspace and facilitate your
          passive income, we require additional documentation for legal
          compliance. Please be assured that all your information will be
          securely stored and handled with utmost confidentiality.
          <br />
          <br />
          Please upload additional documents to complete your claim.
        </p>
        {requestDocument && requestDocument?.description && (
          <>
            <hr className="bg-[#D5DCEB] w-full" />
            <p className="font-normal text-base text-[#87878D]">
              We need:{" "}
              <span className="font-bold">
                {formatTextToReadable(requestDocument?.description)}
              </span>
            </p>
          </>
        )}

        <div
          {...(getRootProps() as DropzoneRootProps)}
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500"
        >
          {selectedFiles[0] ? (
            <div>{selectedFiles[0].name}</div>
          ) : isMobile ? (
            <p className="text-base font-medium text-[#87878D]">
              Click to upload Document
            </p>
          ) : (
            <p className="text-base font-medium text-[#87878D]">
              Drag here or click to upload
            </p>
          )}
        </div>

        {requestDocument?.description === "PROOF_OF_OWNERSHIP" && (
          <div>
            <div className="overflow-y-auto max-h-60 text-gray-600 mb-4 p-2 border border-gray-300 rounded">
              <p>
                To prove home ownership, you’ll typically need one or more of
                the following documents:
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-2">
                <li>
                  <strong>Deed</strong>: The most definitive proof of ownership
                  is your property deed, which shows you as the legal owner.
                </li>
                <li>
                  <strong>Title</strong>: The title indicates your legal
                  ownership of the property and is often accompanied by title
                  insurance.
                </li>
                <li>
                  <strong>
                    Mortgage Statement or Satisfaction of Mortgage
                  </strong>
                  : Your mortgage statement or a letter from your lender can
                  serve as proof of ownership.
                </li>
                <li>
                  <strong>Property Tax Records</strong>: Property tax bills or
                  records can serve as proof of ownership.
                </li>
                <li>
                  <strong>Homeowner’s Insurance Policy</strong>: Your insurance
                  policy typically lists the property owner.
                </li>
                <li>
                  <strong>Closing Documents</strong>: Includes the purchase
                  agreement and closing disclosure outlining the transfer of
                  ownership.
                </li>
              </ol>
              <h3 className="mt-4 font-semibold">
                Where to Obtain These Documents:
              </h3>
              <ul className="list-disc list-inside mt-2 space-y-2">
                <li>
                  <strong>County Clerk or Recorder’s Office</strong>: For deed
                  and title documents.
                </li>
                <li>
                  <strong>Title Company</strong>: If used during the purchase.
                </li>
                <li>
                  <strong>Mortgage Lender</strong>: For mortgage-related
                  documents.
                </li>
                <li>
                  <strong>Property Tax Office</strong>: For property tax
                  records.
                </li>
                <li>
                  <strong>Your Records</strong>: Copies of closing documents,
                  insurance policies, or your deed.
                </li>
              </ul>
              <p className="mt-4">
                Having one or more of these documents will help you establish
                ownership of your home.
              </p>
            </div>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="mr-2"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              I acknowledge that I have read and understood the document
              requirements.
            </label>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            className={`flex justify-center items-center mt-4  w-full text-white bg-dark-blue text-base rounded-[5px] ${requestDocument?.description !== "PROOF_OF_OWNERSHIP" || (isChecked && requestDocument?.description === "PROOF_OF_OWNERSHIP") ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            disabled={
              requestDocument?.description !== "PROOF_OF_OWNERSHIP" ||
              (requestDocument?.description === "PROOF_OF_OWNERSHIP" &&
                !isChecked)
            }
          >
            <LoadingButton
              onClick={handleClick}
              isLoading={loading}
              color={"white"}
              className={`flex justify-center w-full h-full px-[10px] py-[17px] ${requestDocument?.description !== "PROOF_OF_OWNERSHIP" || (isChecked && requestDocument?.description === "PROOF_OF_OWNERSHIP") ? "opacity-100 cursor-pointer" : "opacity-50 cursor-not-allowed"} `}
            >
              Submit Additional Documents
            </LoadingButton>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
