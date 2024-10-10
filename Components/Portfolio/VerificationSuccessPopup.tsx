import React, { useEffect, useState } from "react";
import { CancelIconWhite, SuccessIcon, SuccessIconwhite } from "../Icons";
import { useMobile } from "@/hooks/useMobile";

const VerificationSuccessPopup: React.FC = () => {
  const { isMobile } = useMobile();
  const [showPopup, setShowPopup] = useState(true);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div
          className={`fixed ${isMobile ? "inset-0 bg-green-500" : "right-0 top-24"} z-50 flex flex-col items-center justify-center gap-12 p-4`}
        >
          <div className="absolute right-4 top-4">
            <button onClick={handleClose} className="h-6 w-6 text-white">
              <CancelIconWhite />
            </button>
          </div>
          {isMobile ?
            <>
              <div className="flex h-24 w-24 items-center justify-center">
                <SuccessIconwhite />
              </div>
              <div className="flex w-60 flex-col gap-6 text-center text-white">
                <p className="text-xl font-medium">
                  Thanks, your additional documents have been successfully submitted.
                </p>
                <p className="px-8 text-sm font-normal">
                  Wait for our team to review your documents. Once your KYC verification is successfully completed,
                  you&apos;ll instantly earn 10 SKY points.
                </p>
                <div className="flex items-center justify-center">
                  <button onClick={handleClose} className="w-[174px] rounded border py-3 text-sm text-white">
                    Close
                  </button>
                </div>
              </div>
            </>
          : <div className="w-auto rounded bg-white">
              <div className="flex items-center justify-between p-4">
                <div className="h-4 w-4">
                  <SuccessIcon />
                </div>
                <div className="p-2 text-[14px] text-green-500">
                  <p>Thanks, your additional documents have been successfully submitted.</p>
                </div>

                <button
                  className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-sm text-black"
                  onClick={handleClose}
                >
                  ✖
                </button>
              </div>
            </div>
          }
        </div>
      )}
    </>
  );
};

export default VerificationSuccessPopup;
