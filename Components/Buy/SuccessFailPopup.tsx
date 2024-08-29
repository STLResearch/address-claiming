import { useEffect, useRef } from "react";
import { CloseIcon, CloseIconWhite, SuccessIconwhite } from "../Icons";
import { getTokenLink } from "@/hooks/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuctionPropertyI, PropertyData } from "@/types";
import { useMobile } from "@/hooks/useMobile";

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
  console.log({ data });
  const router = useRouter();
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
      className={`fixed inset-0 z-50 flex items-start sm:pt-32 justify-center bg-[#294B63] bg-opacity-50 backdrop-blur-[2px]`}
    >
      <div
        className={`relative w-[100vw] h-[100vh] sm:w-[422px] sm:h-[525px]  z-40 flex flex-col items-center justify-center sm:rounded-3xl ${responseStatus === "SUCCESS" ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
      >
        {
          <div
            onClick={() => {
              setShowSuccessAndErrorPopup(false);
              setShowDetail(false);
            }}
            className="w-[26px] h-[26px] absolute top-[10px] right-[10px] "
          >
            <div className="w-[14.6px] h-[14.6px] mt-[20px] mr-[23px] cursor-pointer">
              <CloseIcon color="#fff" />
            </div>
          </div>
        }

        <div className="w-[54.56px] h-[54.56px]">
          {responseStatus === "SUCCESS" ? (
            <SuccessIconwhite />
          ) : (
            <CloseIconWhite />
          )}
        </div>

        <div className="w-[80%] mt-[13px]">
          <div className="font-[400] text-[14px] leading-7 text-center text-[#FFFFFF] font-poppins">
            {responseStatus !== "SUCCESS" && (
              <div>
                <div className="text-[20px] font-medium leading-[30px]">
                  An error occured{" "}
                </div>
                <p className="mt-[18px] font-normal text-[18px] leading-[27px]">
                  please try again later
                </p>
              </div>
            )}
          </div>
        </div>

        {responseStatus === "SUCCESS" && (
          <div className="flex flex-col gap-4 w-[80%] text-white text-center">
            <p className="font-medium text-2xl text-center  leading-[48px]">
              {popupType === "BID"
                ? "You made a bid"
                : "You created an auction"}
            </p>
            {popupType === "BID" ? (
              <p className="text-base leading-[27px] text-center text-[#FFFFFF]">
                You bid{" "}
                <span className="font-bold text-[18px]">
                  {" "}
                  &#36;{data?.currentUserBid}{" "}
                </span>{" "}
                <br /> for <b>{data?.address} </b>
              </p>
            ) : (
              <p className="text-sm font-light">
                You have successfully added{" "}
                <span className="font-bold">{data?.address}</span> to the
                auction house.
              </p>
            )}
            {popupType === "BID" ? (
              <div className="font-normal mt-[36px] text-sm leading-[21px] text-center text-[#FFFFFF]">
                <p>Wait for your bid to be reviewed by the owner.</p>
                <p>You will get notified once it’s done.</p>
                <p className="text-sm">
                  View transaction on{" "}
                  <a
                    className="underline"
                    href={`https://solana.fm/tx/${txHash}?cluster=devnet-alpha`}
                    target="blank"
                  >
                    solana.fm
                  </a>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm">
                  You will now receive bids on this property.
                </p>
                <p className="text-sm">
                  View transaction on{" "}
                  <a
                    className="underline"
                    href={`https://solana.fm/tx/${txHash}?cluster=devnet-alpha`}
                    target="blank"
                  >
                    solana.fm
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col w-full items-center mt-[40px]">
          {responseStatus === "SUCCESS" && (
            <>
              <button
                onClick={() => router.push("/marketplace")}
                className=" py-2 w-[50%] h-[41px]  border rounded-md gap-10 text-[#34A853] text-center bg-[#FFFFFF] text-[14px]"
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
              className=" mt-[10px] py-2 w-[50%] h-[41px]  border rounded-md gap-10 text-center text-[#FFFFFF] text-[14px]"
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
