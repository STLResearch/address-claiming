import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument } from "@/types";
import { downloadFile } from "@/utils/portfolio/downloadFile";

const UploadVerifiedDocuments = ({
  requestDocument,
}: {
  requestDocument: RequestDocument[];
}) => {

  const handleDownload = (url: string, doc: RequestDocument, index: number) => {
    downloadFile(url, `${doc.description}-${index + 1}`);
  };

  return (
    <div className="p-4 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="md:w-[30%] w-full">
          <p className=" mt-4 text-[#87878D] text-[12px] flex  items-center">
              Additional <br/>
              Documents Provided
          </p>
        </div>
        <div className="md:w-[70%] w-full  flex flex-row flex-wrap justify-end items-center gap-[15px] mt-4">
          {requestDocument.map((doc) =>
            doc?.status === "SUBMITTED" && doc.previewUrl?.length > 0 ? (
              doc.previewUrl.map((previewUrl, index) => (
                <div
                  key={`${doc.id}-${index}`}
                  onClick={() => handleDownload(previewUrl, doc, index)}
                  className="w-[235px] md:w-[200px] h-auto max-w-full px-2 py-2 flex justify-center items-center border rounded-md gap-4 cursor-pointer"
                >
                  <FileIcon />
                  <div>
                    <p className="text-[#232F4A] text-sm">
                      {formatTextToReadable(`${doc.description}-${index + 1}`)}
                    </p>
                  </div>
                </div>
              ))
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVerifiedDocuments;
