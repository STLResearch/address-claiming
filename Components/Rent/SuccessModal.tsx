import React, { useEffect, useRef } from "react";
import { CloseIconWhite, SuccessIconwhite, CloseIcon } from "../Icons";
import { getTransactionLink } from "@/hooks/utils";
import Link from "next/link";
import { PropertyData } from "@/types";
import Backdrop from "../Backdrop";
interface SuccessModalProps {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  finalAns: { status: string; message?: string | undefined } | null | undefined;
  rentData: PropertyData | undefined | null;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ setShowSuccess, finalAns, rentData, setShowClaimModal }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSuccess(false);
        setShowClaimModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuccess, setShowClaimModal]);

  const handalClosePop = () => {
    setShowSuccess(false);
    setShowClaimModal(false);
  };

  return (
    <div>
      <Backdrop />
      <div
        ref={modalRef}
        className={`fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 bg-white md:max-w-sm md:rounded-[30px]`}
      >
        <div
          className={`z-40 flex h-screen w-[100%] flex-col items-center gap-[15px] py-10 md:h-[100%] md:rounded-3xl ${finalAns?.status === "Rent Successful" ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
        >
          <div
            onClick={() => {
              setShowSuccess(false);
              setShowClaimModal(false);
            }}
            className="absolute right-[10px] top-[10px] h-[26px] w-[26px]"
          >
            <div className="absolute right-[10px] top-[10px] hidden cursor-pointer sm:block">
              <CloseIcon />
            </div>
          </div>

          <div className="mt-24 h-16 w-16 md:mt-6">
            {finalAns?.status === "Rent Successful" ?
              <SuccessIconwhite />
            : <CloseIconWhite />}
          </div>
          {finalAns?.status === "Rent Successful" ?
            <>
              <div className="mt-6 w-full">
                <h1 className="font-poppins text-center text-xl font-medium text-[#FFFFFF]">
                  Your rental order is being processed
                </h1>
              </div>
            </>
          : <>
              <div className="mt-6 w-full">
                <h1 className="font-poppins text-center text-xl font-medium text-[#FFFFFF]">Rent failed</h1>
              </div>
            </>
          }

          <div className="mt-4 w-full px-6 md:mt-[2rem]">
            <div className="font-poppins text-center text-lg font-normal leading-7 text-[#FFFFFF]">
              {finalAns?.status === "Rent Successful" && (
                <div>
                  &apos;Your rental for&apos;{" "}
                  {rentData && (
                    <>
                      <span className="text-lg font-bold">{`${rentData.address}`}</span>{" "}
                    </>
                  )}
                  {`is being processed. The rental amount is`}{" "}
                  {rentData && <span className="text-lg font-bold">${rentData.price}</span>}
                </div>
              )}
            </div>

            <div className="font-poppins text-center text-lg font-normal leading-7 text-[#FFFFFF]">
              {finalAns?.status !== "Rent Successful" && <div>{`${finalAns?.message}`}</div>}
            </div>
          </div>

          {finalAns?.status === "Rent Successful" && (
            <div className="w-[75%]">
              <p className="text-center text-[10px] font-normal text-[#FFFFFF]">
                A copy of your transaction is availble inside your Portfolio{" "}
              </p>
            </div>
          )}

          {finalAns?.status === "Rent Successful" && (
            <>
              <Link
                target="_blank"
                href={getTransactionLink(finalAns.message)}
                className="py-2 text-center text-[14px] font-bold text-[#FFFFFF] underline"
              >
                View Transaction Link
              </Link>
            </>
          )}

          {finalAns?.status === "Rent Successful" ?
            <>
              <button
                onClick={() => setShowClaimModal(false)}
                className="h-[41px] w-[50%] gap-10 rounded-md border bg-[#34A853] py-2 text-center text-lg text-[#FFFFFF]"
              >
                Portfolio
              </button>
            </>
          : <>
              <button
                onClick={handalClosePop}
                className="mt-[2.5rem] h-[41px] w-[50%] gap-10 rounded-md border py-2 text-center text-lg text-[#FFFFFF]"
              >
                Close
              </button>
            </>
          }
        </div>
      </div>
    </div>
  );
};
export default SuccessModal;
