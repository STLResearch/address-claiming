import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument } from "@/types";
import { downloadFile } from "@/utils/portfolio/downloadFile";

const UploadedDocuments = ({
  requestDocument,
}: {
  requestDocument: RequestDocument[];
}) => {

  const handleDownload = (url: string, doc: RequestDocument, index: number) => {
    downloadFile(url, `${doc.description}-${index + 1}`);
  };
  return (
    <div className="p-4 mt-4">
      {requestDocument.map((document) => (
        document?.status === 'SUBMITTED' &&
        <div
          key={document.id}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        >
          <div className="md:w-[40%] w-full">
            <p className="px-10 mt-4 text-[#87878D] text-[12px] flex justify-center items-center">
              We requested your {formatTextToReadable(document.description)}
            </p>
          </div>
          <div className="md:w-[60%] w-full flex flex-col md:flex-row md:flex-wrap justify-end items-center gap-8 mt-4">
            {document.previewUrl && document.previewUrl?.length > 0 && document.previewUrl?.map((url, urlIndex) => (
              <div
                key={urlIndex}
                className="w-[235px] md:w-[274px] h-auto max-w-full px-4 py-4 flex justify-center items-center border rounded-md gap-4"
                onClick={() => handleDownload(url, document, urlIndex)}
              >
                <FileIcon />
                <div>
                  <p className="text-[#1F7DFD] text-xs">
                    {formatTextToReadable(`${document.description}-${urlIndex+1}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UploadedDocuments;
