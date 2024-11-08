import React from "react";
import { FileIcon } from "../Icons";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocument } from "@/types";
import { downloadFile } from "@/utils/portfolio/downloadFile";

const UploadVerifiedDocuments = ({ requestDocument }: { requestDocument: RequestDocument[] }) => {
  const handleDownload = (url: string, doc: RequestDocument, index: number) => {
    downloadFile(url, `${doc.description}-${index + 1}`);
  };

  return (
    <div className="mt-4 py-4">
      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
        <div className="w-full md:w-[30%]">
          <p className="mt-4 flex items-center text-[12px] text-[#87878D]">
            Additional <br />
            Documents Provided
          </p>
        </div>
        <div className="mt-4 flex w-full flex-row flex-wrap items-center justify-end gap-[15px] md:w-[70%]">
          {requestDocument.map((doc) =>
            doc?.status === "SUBMITTED" && doc.previewUrl?.length > 0 ?
              doc.previewUrl.map((previewUrl, index) => (
                <div
                  key={`${doc.id}-${index}`}
                  onClick={() => handleDownload(previewUrl, doc, index)}
                  className="flex h-auto w-[235px] max-w-full cursor-pointer items-center justify-center gap-4 rounded-md border px-2 py-2 md:w-[200px]"
                >
                  <FileIcon />
                  <div>
                    <p className="text-sm text-[#232F4A]">{formatTextToReadable(`${doc.description}-${index + 1}`)}</p>
                  </div>
                </div>
              ))
            : null
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVerifiedDocuments;
