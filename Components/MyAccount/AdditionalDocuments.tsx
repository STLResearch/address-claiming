import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useDropzone, DropzoneRootProps } from "react-dropzone";
import { CloseIconBlack } from "../Icons";
import { useMobile } from "@/hooks/useMobile";
import useAuth from "@/hooks/useAuth";
import UserService from "@/services/UserService";
import { toast } from "react-toastify";
import DocumentUploadServices from "@/services/DocumentUploadServices";
import { formatTextToReadable, isFileSizeValid, isValidFileType, uploadImage } from "@/utils/propertyUtils/fileUpload";
import LoadingButton from "../LoadingButton/LoadingButton";
import { RequestDocumentStatus } from "@/types";
import S3UploadServices from "@/services/s3upload";

interface PopupProps {
  showPopup: boolean;
  closePopup: () => void;
  setShowAdditionalDoc: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSuccessToast: Dispatch<SetStateAction<boolean>>;
  setUploadedDoc: React.Dispatch<React.SetStateAction<File[]>>;
  setShowUnderReviewDoc: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdditionalDocuments: React.FC<PopupProps> = ({
  showPopup,
  closePopup,
  setShowAdditionalDoc,
  setShowSuccessToast,
  setUploadedDoc,
  setShowUnderReviewDoc,
}) => {
  const { isMobile } = useMobile();
  const { user, signIn } = useAuth();
  const { getUser } = UserService();

  const { updateDocument } = DocumentUploadServices();
  const { generatePublicFileUploadUrl } = S3UploadServices();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const requestDocument = useMemo(() => {
    return user?.requestDocument.find((doc) => doc.status === RequestDocumentStatus.NOT_SUBMITTED);
  }, [user]);

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
    if (!requestDocument) {
      toast.error("No document request at the moment");
      return;
    }

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

      setShowSuccessToast(true);
      setUploadedDoc((prev) => [...prev, selectedFiles[0]]);
      setTimeout(() => setShowSuccessToast(false), 5000);
      setShowAdditionalDoc(true);
      closePopup();
      setShowUnderReviewDoc(true);
      const responseData = await getUser();
      if (responseData?.id) {
        signIn({ user: responseData });
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred during the upload process");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="min-h-80 fixed bottom-0 flex flex-col gap-[15px] rounded-t-[30px] bg-white px-[30px] py-[30px] md:relative md:top-0 md:w-[566px] md:rounded-[15px] md:px-[20px] md:py-[20px]"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div>
          {isMobile ?
            <div className="flex flex-col items-center justify-center">
              <div onClick={closePopup} className="w-[20%] cursor-pointer rounded-md border-4 border-dark-grey">
                {" "}
              </div>
              <h2 className="mt-4 text-xl font-medium text-[#222222]">Documents</h2>
            </div>
          : <div className="flex justify-between">
              <h2 className="text-xl font-medium text-[#222222]">Documents</h2>
              <div onClick={closePopup} className="h-4 w-4 cursor-pointer">
                <CloseIconBlack />
              </div>
            </div>
          }
        </div>
        {requestDocument && requestDocument?.description && (
          <>
            <hr className="w-full bg-[#D5DCEB]" />
            <p className="text-base font-normal text-[#87878D]">
              We need: <span className="font-bold">{formatTextToReadable(requestDocument?.description)}</span>
            </p>
          </>
        )}
        <div
          {...(getRootProps() as DropzoneRootProps)}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 hover:border-blue-500"
        >
          {isMobile ?
            <p className="text-base font-medium text-[#87878D]">
              {selectedFiles[0] ? selectedFiles[0].name : "click to upload Document"}
            </p>
          : <p className="text-base font-medium text-[#87878D]">
              {selectedFiles[0] ? selectedFiles[0].name : "Drag here or click to upload"}
            </p>
          }
        </div>

        <LoadingButton
          onClick={handleClick}
          isLoading={loading}
          color={"white"}
          className="mt-4 flex justify-center bg-dark-blue px-6 py-2 text-base text-white"
        >
          Submit Additional Documents
        </LoadingButton>
      </div>
    </div>
  );
};

export default AdditionalDocuments;
