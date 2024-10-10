import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument, RequestDocumentStatus } from "@/types";

const UploadVerifiedDocuments = ({ requestDocument }: { requestDocument: RequestDocument[] }) => {
  const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const handelDown = () => {
    downloadFile(requestDocument[0].previewUrl, requestDocument[0].id);
  };
  return (
    <div className="mt-4 p-4">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="w-full md:w-[40%]">
          <p className="mt-4 flex items-center justify-center px-10 text-[12px] text-[#87878D]">
            Additional Documents Porvided
          </p>
        </div>
        <div
          onClick={handelDown}
          className="mt-4 flex w-full flex-col items-center justify-end gap-8 md:w-[60%] md:flex-row"
        >
          <div className="flex h-[49px] max-h-full w-[235px] max-w-full items-center justify-center gap-4 rounded-md border px-4 py-4 md:w-[274px]">
            <FileIcon />

            <div>
              <p className="text-sm text-[##232F4A]">{formatTextToReadable(requestDocument?.[0]?.description)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadVerifiedDocuments;
