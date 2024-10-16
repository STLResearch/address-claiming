import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument, RequestDocumentStatus } from "@/types";

const UploadVerifiedDocuments = ({
  requestDocument,
}: {
  requestDocument: RequestDocument[];
}) => {
 const downloadFile = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
const handelDown = () =>{
  downloadFile(requestDocument[0].previewUrl, requestDocument[0].id)
}
  return (
    <div className="p-4 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
        <div className="md:w-[40%] w-full">
          <p className="px-10 mt-4 text-[#87878D] text-[12px] flex justify-center items-center">
          Additional Documents Porvided
          </p>
        </div>
        <div 
        onClick={handelDown}
        className="md:w-[60%] w-full flex flex-col md:flex-row justify-end items-center gap-8 mt-4">
          <div className="w-[235px] md:w-[274px] h-[49px] max-w-full max-h-full px-4 py-4 flex justify-center items-center border rounded-md gap-4">
            <FileIcon />

            <div>
              <p className="text-[##232F4A] text-sm">
                {formatTextToReadable(requestDocument?.[0]?.description)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVerifiedDocuments;
