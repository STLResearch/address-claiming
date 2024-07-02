import { useEffect, useRef } from "react";
import { CloseIcon, CloseIconWhite, SuccessIconwhite } from "../Icons";
import { getTokenLink } from "@/hooks/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuctionPropertyI, PropertyData } from "@/types";
import { useMobile } from "@/hooks/useMobile";

interface SuccessFailPopupProps {
  setShowSuccessAndErrorPopup: React.Dispatch<React.SetStateAction<boolean>>;
  bidResponseStatus: "SUCCESS" | "FAIL";
  successBidData?: AuctionPropertyI;
  setShowBidDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessFailPopup: React.FC<SuccessFailPopupProps> = ({
  setShowSuccessAndErrorPopup,
  bidResponseStatus,
  successBidData,
  setShowBidDetail,
}) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSuccessAndErrorPopup(false);
        setShowBidDetail(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuccessAndErrorPopup, setShowBidDetail]);

  return (
    <div
      ref={modalRef}
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[600]`}
    >
      <div
        className={`w-[100vw] h-[100vh] sm:w-[422px] sm:h-[525px]  z-40 flex flex-col items-center justify-center sm:rounded-3xl ${bidResponseStatus === "SUCCESS" ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
      >
        {
          <div
            onClick={() => {
              setShowSuccessAndErrorPopup(false);
              setShowBidDetail(false);
            }}
            className="w-[26px] h-[26px] absolute top-[10px] right-[10px] "
          >
            <div className="w-[14.6px] h-[14.6px] mt-[20px] mr-[23px] cursor-pointer">
              <CloseIcon color="#fff" />
            </div>
          </div>
        }

        <div className="w-[54.56px] h-[54.56px]">
          {bidResponseStatus === "SUCCESS" ? (
            <SuccessIconwhite />
          ) : (
            <CloseIconWhite />
          )}
        </div>

        <div className="w-[80%] mt-[13px]">
          <div className="font-[400] text-[14px] leading-7 text-center text-[#FFFFFF] font-poppins">
            {bidResponseStatus !== "SUCCESS" && (
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

        {bidResponseStatus === "SUCCESS" && (
          <div className=" w-[80%] ">
            <p className="font-medium text-[32px] text-center text-[#FFFFFF] leading-[48px]">
              You made a bid
            </p>
            <p className="font-[400] mt-[24.5px] text-[18px] leading-[27px] text-center text-[#FFFFFF]">
              You bid{" "}
              <span className="font-bold text-[18px]">
                {" "}
                &#36;{successBidData?.currentUserBid}{" "}
              </span>{" "}
              <br /> for <b>{successBidData?.address} </b>
            </p>
            <div className="font-normal mt-[36px] text-[14px] leading-[21px] text-center text-[#FFFFFF]">
              <p>Wait for your bid to be reviewed by the owner.</p>
              <p>You will get notified once it’s done.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col w-full items-center mt-[40px]">
          {bidResponseStatus === "SUCCESS" && (
            <>
              <button
                onClick={() => router.push("/buy")}
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
                setShowBidDetail(false);
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
