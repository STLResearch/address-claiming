import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument } from "@/types";

const UploadedDocuments = ({
  requestDocument,
}: {
  requestDocument: RequestDocument[];
}) => {
  return (
    <div className="p-4 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
        <div className="md:w-[40%] w-full">
          <p className="px-10 mt-4 text-[#87878D] text-[12px] flex justify-center items-center">
            We requested your{" "}
            {formatTextToReadable(requestDocument[0]?.description)}
          </p>
        </div>
        <div className="md:w-[60%] w-full flex flex-col md:flex-row justify-end items-center gap-8 mt-4">
          <div className="w-[235px] md:w-[274px] h-[49px] max-w-full max-h-full px-4 py-4 flex justify-center items-center border rounded-md gap-4">
            <FileIcon />
            <div>
              <p className="text-[#1F7DFD] text-xs">
                {formatTextToReadable(requestDocument[0]?.description)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedDocuments;
