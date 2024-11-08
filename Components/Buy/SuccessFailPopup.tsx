import React, { useEffect, useRef } from "react";
import { CloseIcon, CloseIconWhite, SuccessIconwhite } from "../Icons";
import { useRouter } from "next/navigation";

interface SuccessFailPopupProps {
  setShowSuccessAndErrorPopup: React.Dispatch<React.SetStateAction<boolean>>;
  responseStatus: "SUCCESS" | "FAIL";
  popupType?: "BID" | "CREATE";
  data: {
    address: string;
    currentUserBid?: number | null;
  };
  txHash?: string;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessFailPopup: React.FC<SuccessFailPopupProps> = ({
  setShowSuccessAndErrorPopup,
  responseStatus,
  popupType = "BID",
  data,
  txHash,
  setShowDetail,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSuccessAndErrorPopup(false);
        setShowDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuccessAndErrorPopup, setShowDetail]);

  return (
    <div
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-start justify-center bg-[#294B63] bg-opacity-50 backdrop-blur-[2px] sm:pt-32`}
    >
      <div
        className={`relative z-40 flex h-[100vh] w-[100vw] flex-col items-center justify-center sm:h-[585px] sm:w-[422px] sm:rounded-3xl ${responseStatus === "SUCCESS" ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
      >
        {
          <div
            onClick={() => {
              setShowSuccessAndErrorPopup(false);
              setShowDetail(false);
            }}
            className="absolute right-[10px] top-[10px] h-[26px] w-[26px]"
          >
            <div className="mr-[23px] mt-[20px] h-[14.6px] w-[14.6px] cursor-pointer">
              <CloseIcon color="#fff" />
            </div>
          </div>
        }

        <div className="h-[54.56px] w-[54.56px]">
          {responseStatus === "SUCCESS" ?
            <SuccessIconwhite />
          : <CloseIconWhite />}
        </div>

        <div className="mt-[13px] w-[80%]">
          <div className="font-poppins text-center text-[14px] font-[400] leading-7 text-[#FFFFFF]">
            {responseStatus !== "SUCCESS" && (
              <div>
                <div className="text-[20px] font-medium leading-[30px]">An error occured </div>
                <p className="mt-[18px] text-[18px] font-normal leading-[27px]">please try again later</p>
              </div>
            )}
          </div>
        </div>

        {responseStatus === "SUCCESS" && (
          <div className="flex w-[80%] flex-col gap-2 text-center text-white">
            <p className="text-center text-2xl font-medium leading-[48px]">
              {popupType === "BID" ? "Bid Submitted" : "Auction Created"}
            </p>
            {popupType === "BID" ?
              <p className="mt-4 text-center text-base leading-[27px] text-[#FFFFFF]">
                You bid <span className="text-[18px] font-bold"> &#36;{data?.currentUserBid} </span> <br /> for{" "}
                <b>{data?.address} </b>
              </p>
            : <p className="text-sm font-light">
                You have successfully added <span className="font-bold">{data?.address}</span> to the auction house.
              </p>
            }
            {popupType === "BID" ?
              <div className="mt-4 text-center text-sm font-normal leading-[21px] text-[#FFFFFF]">
                <p>It may take up to a minute for your bid</p>
                <p>to reflect in the auction house.</p>
                <p className="mt-1">You will get notified if you win,</p>
                <p>or are outbid by another</p>
                <p className="mt-2 text-sm">
                  View transaction on{" "}
                  <a className="underline" href={`https://solana.fm/tx/${txHash}?cluster=devnet-alpha`} target="blank">
                    solana.fm
                  </a>
                </p>
              </div>
            : <div className="flex flex-col gap-1">
                <p className="text-sm">You will now receive bids on this property.</p>
                <p className="text-sm">
                  View transaction on{" "}
                  <a className="underline" href={`https://solana.fm/tx/${txHash}?cluster=devnet-alpha`} target="blank">
                    solana.fm
                  </a>
                </p>
              </div>
            }
          </div>
        )}

        <div className="mt-[40px] flex w-full flex-col items-center">
          {responseStatus === "SUCCESS" && (
            <>
              <button
                onClick={() => {
                  setShowSuccessAndErrorPopup(false);
                  setShowDetail(false);
                }}
                className="h-[41px] w-[50%] gap-10 rounded-md border bg-[#FFFFFF] py-2 text-center text-[14px] text-[#34A853]"
              >
                Marketplace
              </button>
            </>
          )}
          <>
            <button
              onClick={() => {
                setShowSuccessAndErrorPopup(false);
                setShowDetail(false);
              }}
              className="mt-[10px] h-[41px] w-[50%] gap-10 rounded-md border py-2 text-center text-[14px] text-[#FFFFFF]"
            >
              Close
            </button>
          </>
        </div>
      </div>
    </div>
  );
};
export default SuccessFailPopup;
