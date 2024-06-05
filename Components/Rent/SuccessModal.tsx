import { useEffect, useRef } from "react";
import { CloseIconWhite, SuccessIconwhite } from "../Icons";
import { getTokenLink } from "@/hooks/utils";
import Link from "next/link";
import router from "next/router";
import { PropertyData } from "@/types";

interface SuccessModalProps {
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  finalAns:
    | { status: string; message: string | undefined; tokenId?: string }
    | null
    | undefined;
  rentData: PropertyData | undefined | null;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  setShowSuccess,
  finalAns,
  rentData,
  setShowClaimModal,
}) => {
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

  return (
    <div
      ref={modalRef}
      className={`w-[100%] max-w-[20rem] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40`}
    >
      <div
        className={` w-[100%] h-[500px] py-10 z-40 flex flex-col gap-[15px] items-center  rounded-3xl ${finalAns?.status === "Rent Successful" ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
      >
        <div
          onClick={() => {
            setShowSuccess(false);
            setShowClaimModal(false);
          }}
          className="w-[26px] h-[26px] absolute top-[10px] right-[10px] "
        >
          <CloseIconWhite />
        </div>

        <div className="w-[54.56px] h-[54.56px]">
          {finalAns?.status === "Rent Successful" ? (
            <SuccessIconwhite />
          ) : (
            <CloseIconWhite />
          )}
        </div>
        {finalAns?.status === "Rent Successful" ? (
          <>
            <div className="w-[70%] h-[10%] ">
              <h1 className=" font-[500]  text-[22px] text-center text-[#FFFFFF] font-poppins">
                Your rental order is complete
              </h1>
            </div>
          </>
        ) : (
          <>
            <div className="w-[70%] h-[10%] ">
              <h1 className=" font-[500]  text-[22px] text-center text-[#FFFFFF] font-poppins">
                Rent failed
              </h1>
            </div>
          </>
        )}

        <div className="w-[80%] mt-[2rem] ">
          <div className="font-[400] text-[14px] leading-7 text-center text-[#FFFFFF] font-poppins">
            {finalAns?.status === "Rent Successful" && (
              <div>
                'You rented'{" "}
                {rentData && (
                  <>
                    <span className=" text-[14px] font-bold">{`${rentData.address}`}</span>{" "}
                  </>
                )}
                {` for `}{" "}
                {rentData && (
                  <span className=" text-[14px] font-bold">
                    ${rentData.price}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="font-[400] text-[14px] leading-7 text-center text-[#FFFFFF] font-poppins">
            {finalAns?.status !== "Rent Successful" && (
              <div>An error occured, please try again.</div>
            )}
          </div>
        </div>

        {finalAns?.status === "Rent Successful" && (
          <div className=" w-[75%] ">
            <p className="font-[400] text-[10px] text-center text-[#FFFFFF]">
              A copy of your transaction is availble inside your Portfolio{" "}
            </p>
          </div>
        )}

        {finalAns?.status === "Rent Successful" && (
          <>
            <Link
              target="_blank"
              href={getTokenLink(finalAns.tokenId)}
              className="py-2 font-boldtext-center text-[#FFFFFF] text-[14px] underline"
            >
              Transaction Link
            </Link>
          </>
        )}

        {finalAns?.status === "Rent Successful" ? (
          <>
            <button
              onClick={()=> ( setShowClaimModal(false))}
              className=" py-2 w-[50%] h-[41px]  border rounded-md gap-10 bg-[#34A853] text-center text-[#FFFFFF] text-[14px]"
            >
              Portfolio
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setShowSuccess(false);
                setShowClaimModal(false);
              }}
              className=" mt-[2.5rem] py-2 w-[50%] h-[41px]  border rounded-md gap-10 text-center text-[#FFFFFF] text-[14px]"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default SuccessModal;
