import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useDropzone, DropzoneRootProps } from "react-dropzone";
import { CloseIconBlack } from "../Icons";
import { useMobile } from "@/hooks/useMobile";
import useAuth from "@/hooks/useAuth";
import UserService from "@/services/UserService";
import { toast } from "react-toastify";
import DocumentUploadServices from "@/services/DocumentUploadServices";
import {
  formatTextToReadable,
  isFileSizeValid,
  isValidFileType,
  uploadImage,
} from "@/utils/propertyUtils/fileUpload";
import LoadingButton from "../LoadingButton/LoadingButton";
import { RequestDocumentStatus } from "@/types";
import S3UploadServices from "@/services/s3upload";
import ACCEPTED_FILE_TYPES from "@/utils/portfolio/fileTypes";

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
    return user?.requestDocument.find(
      (doc) => doc.status === RequestDocumentStatus.NOT_SUBMITTED,
    );
  }, [user]);

  const onDrop = (acceptedFiles: File[]) => {
    const isValid = acceptedFiles.every((file) => isFileSizeValid(file));
    if (isValid) {
      setSelectedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    } else {
      toast.error("File size must be less than 20MB!");
    }
  };
  const removeFile = (file: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(f => f !== file));
  };

  const { getRootProps, getInputProps , isDragActive } = useDropzone(
    { onDrop, 
      multiple: true ,
      accept: ACCEPTED_FILE_TYPES,
      maxFiles: 5,
    });

  if (!showPopup) return null;
  function getContentTypes(files: File[]): string[] {
    return files.map(file => file.type);
  }
  function getFilePaths(response: any[]): string[] {
    return response.map(file => file.key);
  }
  const handleClick = async () => {
    if (!requestDocument) {
      toast.error("No document request at the moment");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please upload a file before submitting!");
      return;
    }
    if (selectedFiles.length > 5) {
      toast.error("You can only upload up to 5 files. Please adjust your selection and try again!");
      return;
    }

    setLoading(true);

    try {
      const generatedRes = await generatePublicFileUploadUrl({
        fileType: getContentTypes(selectedFiles),
        requestId: requestDocument.id,
      });

      if (generatedRes?.length === 0 ) {
        throw new Error("Failed to upload file ");
      }
      const uploadPromises = selectedFiles.map((file, index) => {
        const uploadUrl = generatedRes[index]?.uploadUrl?.uploadUrl; 
        return uploadImage(uploadUrl, file);
      });
      const imageResponses = await Promise.all(uploadPromises);
      const failedUploads = imageResponses.filter(
        (res) => !res || res.data?.status !== "SUCCESS"
      );
      if (failedUploads.length > 0) {
        throw new Error("One or more files failed to upload");
      }
      
      const paths = getFilePaths(generatedRes);
      const updateResponse = await updateDocument({
        paths,
        requestId: Number(requestDocument.id),
      });
      if (!updateResponse) {
        throw new Error("Failed to upload file ");
      }
      setShowSuccessToast(true);
      setUploadedDoc(prevFiles => [...prevFiles, ...selectedFiles]);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="fixed bottom-0 md:relative md:top-0 flex flex-col md:w-[566px] min-h-80  md:py-[20px] py-[30px] md:px-[20px] px-[30px] rounded-t-[30px] md:rounded-[15px] bg-white gap-[15px]"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div>
          {isMobile ? (
            <div className="flex flex-col justify-center items-center">
              <div
                onClick={closePopup}
                className="border-4 border-dark-grey cursor-pointer w-[20%] rounded-md"
              >
                {" "}
              </div>
              <h2 className=" mt-4 text-xl font-medium text-[#222222]">
                Documents
              </h2>
            </div>
          ) : (
            <div className="flex justify-between">
              <h2 className="text-xl font-medium text-[#222222]">Documents</h2>
              <div onClick={closePopup} className="w-4 h-4 cursor-pointer">
                <CloseIconBlack />
              </div>
            </div>
          )}
        </div>
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
            {...getRootProps({
              className: `dropzone ${isDragActive ? 'active' : ''}`,
            })}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500"
          >
            <input {...getInputProps()}/>

          {isMobile ? (
            <p className="text-base font-medium text-[#87878D]">
              "click to upload Document"
            </p>
          ) : (
            <p className="text-base font-medium text-[#87878D]">
              "Drag here or click to upload"
            </p>
          )}
        </div>

        <div className="w-[300px] sm:w-auto ">  
        {selectedFiles?.length > 0 && 
          selectedFiles.map((selectedFile,index)=>(
            <div className="flex justify-between items-center">
              <div className="w-[40%] sm:w-auto truncate" key={index}>{selectedFile.name}</div>
              <div className="w-[40%] sm:w-auto flex justify-end">
                <button onClick={() => removeFile(selectedFile)} className="text-red-400 sm:mr-3 m-0">Remove</button>
              </div>
            </div>
        ))}
        </div>
        <LoadingButton
          onClick={handleClick}
          isLoading={loading}
          color={"white"}
          className="mt-4 px-6 py-2 text-white bg-dark-blue text-base flex justify-center"
        >
          Submit Additional Documents
        </LoadingButton>
      </div>
    </div>
  );
};

export default AdditionalDocuments;
