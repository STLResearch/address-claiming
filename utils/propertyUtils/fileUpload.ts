import { RequestDocumentStatus } from "@/types";
import axios from "axios";

export function isFileSizeValid(file: File, maxSizeInMB: number = 20): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }
  
export function formatTextToReadable(text: string) {
    return text?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase()) ?? "";
  }
  
export const isValidFileType = (fileName: string) => {
    const allowedExtensions = [
      ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".tiff", ".xls", ".xlsx",
      ".txt", ".rtf", ".odt", ".ods", ".html", ".htm", ".ppt", ".pptx"
    ];
    const fileExtension = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
    return allowedExtensions.includes(fileExtension);
  };


export  const uploadImage = async (response: any,file:File) => {
    const url = response?.uploadUrl?.uploadUrl;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("url", url);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_FRONTEND_URI}/api/documentUpload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response;
    } catch {
      return false;
    }
};
export const checkDocumentStatus = (requestDocument) => {
  if (!requestDocument || requestDocument.length === 0) {
    return "NOT_REQUESTED";
  }
  const lastItem = requestDocument[requestDocument.length - 1];
  switch (lastItem.status) {
    case RequestDocumentStatus.APPROVED:
      return "APPROVED";
    case RequestDocumentStatus.SUBMITTED:
      return "SUBMITTED";
    case RequestDocumentStatus.REJECTED:
      return "REJECTED";
    case RequestDocumentStatus.NOT_SUBMITTED:
      if (requestDocument.length > 1) {
        const secondLastItem = requestDocument[requestDocument.length - 2];
        if (secondLastItem.status === RequestDocumentStatus.REJECTED) {
          return "RE_UPLOAD";
        }
      }
      return "NOT_SUBMITTED";
    default:
      return "NOT_REQUESTED";
  }
}