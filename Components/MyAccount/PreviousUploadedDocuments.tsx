import React, { useMemo } from "react";
import { FileIcon } from "../Icons";
import useAuth from "@/hooks/useAuth";
import { formatTextToReadable } from "@/utils/propertyUtils/fileUpload";
import { RequestDocumentStatus } from "@/types";
import Link from "next/link";

const PreviousUploadedDocuments = () => {
  const { user } = useAuth();

  const previousRequest = useMemo(() => {
    return user?.requestDocument?.filter((doc) => doc.status !== RequestDocumentStatus.NOT_SUBMITTED);
  }, [user]);

  if (previousRequest && previousRequest.length > 0) {
    return (
      <div
        className="mt-8 rounded-[30px] bg-white px-4 py-4 shadow-lg"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <h2 className="text-xl font-semibold">My Additional Documents</h2>
        {previousRequest.map((document, index) => (
          <div key={index} className="mt-2 flex flex-col items-start justify-between md:flex-row md:items-center">
            <div className="w-full md:w-[40%]">
              <p className="mt-4 text-[12px] text-[#87878D]">
                We requested your {formatTextToReadable(document.description)}
              </p>
            </div>
            <div className="flex w-full flex-col items-center justify-end gap-8 md:w-[60%] md:flex-row">
              <Link target="_blank" href={document.previewUrl} className="cursor-pointer">
                <div className="flex w-52 items-center justify-start gap-4 rounded-md border px-4 py-4">
                  <FileIcon />
                  <div>
                    <p className="text-xs text-[#1F7DFD]">{formatTextToReadable(document.description)}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <></>;
};

export default PreviousUploadedDocuments;
