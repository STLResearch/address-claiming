import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument } from "@/types";

const UploadedDocuments = ({ requestDocument }: { requestDocument: RequestDocument[] }) => {
  return (
    <div className="mt-4 p-4">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="w-full md:w-[40%]">
          <p className="mt-4 flex items-center justify-center px-10 text-[12px] text-[#87878D]">
            We requested your {formatTextToReadable(requestDocument[0]?.description)}
          </p>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-end gap-8 md:w-[60%] md:flex-row">
          <div className="flex h-[49px] max-h-full w-[235px] max-w-full items-center justify-center gap-4 rounded-md border px-4 py-4 md:w-[274px]">
            <FileIcon />
            <div>
              <p className="text-xs text-[#1F7DFD]">{formatTextToReadable(requestDocument[0]?.description)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedDocuments;
