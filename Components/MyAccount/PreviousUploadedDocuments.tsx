import React, { useMemo } from "react";
import { FileIcon } from "../Icons";
import useAuth from "@/hooks/useAuth";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocumentStatus } from "@/types";
import Link from "next/link";

const PreviousUploadedDocuments = () => {
  const { user } = useAuth();

  const previousRequest = useMemo(() => {
    return user?.requestDocument?.filter(
      (doc) => doc.status !== RequestDocumentStatus.NOT_SUBMITTED,
    );
  }, [user]);

  if (previousRequest && previousRequest.length > 0) {
    return (
      <div
        className="py-4 px-4 mt-8 rounded-[30px] bg-white shadow-lg"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <h2 className="text-xl font-semibold">My Additional Documents</h2>
        {previousRequest.map((document, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mt-2"
          >
            <div className="md:w-[40%] w-full">
              <p className="mt-4 text-[#87878D] text-[12px]">
                We requested your {formatTextToReadable(document.description)}
              </p>
            </div>
            <div className="md:w-[60%] w-full flex flex-col md:flex-row md:flex-wrap justify-end items-center gap-8 mt-3 sm:mt-0">
            {document.previewUrl && document.previewUrl?.length > 0 && document.previewUrl?.map((url, urlIndex) => (
              <Link
              key={urlIndex} 
                target="_blank"
                href={document?.previewUrl[urlIndex]}
                className="cursor-pointer"
              >
                <div className="w-52 px-4 py-4 flex justify-start items-center border rounded-md gap-4">
                  <FileIcon />
                  <div>
                    <p className="text-[#1F7DFD] text-xs">
                      {formatTextToReadable(`${document.description}-${urlIndex+1}`)}
                    </p>
                  </div>
                </div>
              </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default PreviousUploadedDocuments;
