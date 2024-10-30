import { useRouter } from "next/navigation";
import { CircledCloseIcon, SuccessIconwhite } from "../Icons";
import Link from "next/link";
import { getTransactionLink } from "@/hooks/utils";

interface PropsI {
  closePopUp: () => void;
  isSuccess: boolean;
  tx?: string;
  errorMessages: string[];
}

const SuccessModal = ({ closePopUp, isSuccess, errorMessages, tx }: PropsI) => {
  console.log(tx);
  let href = getTransactionLink(tx);
  const router = useRouter();
  const handleButtonClick = () => {
    router.push("/points");
  };

  return (
    <div className="claim-modal-step fixed left-1/2 top-1/2 z-50 flex h-screen max-h-screen w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-[15px] overflow-x-auto overflow-y-auto bg-white md:h-auto md:max-h-[640px] md:w-[689px] md:rounded-[30px]">
      <div className={`h-screen w-[100%] ${isSuccess ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}>
        <div className={`flex h-full w-full flex-col items-center justify-center px-8`}>
          <div className="mt-6 h-16 w-16">
            {isSuccess ?
              <SuccessIconwhite />
            : <CircledCloseIcon />}
          </div>
          <div>
            {isSuccess ?
              <div className="mt-8">
                <h1 className="font-poppins mt-6 px-8 text-center text-xl font-[500] text-[#FFFFFF]">
                  your swap is complete
                </h1>
                <Link
                  href={href}
                  target="_blank"
                  className="font-poppins mt-6 px-10 text-center text-[15px] font-[300] text-[#FFFFFF]"
                >
                  {href}
                </Link>
              </div>
            : <div className="mt-20">
                {errorMessages?.length > 0 ?
                  <>
                    {errorMessages?.map((error) => (
                      <h1 className="font-poppins px-6 text-center text-xl font-[500] text-[#FFFFFF]">{error}</h1>
                    ))}
                  </>
                : <div className="border-2">
                    <h1 className="font-poppins px-6 text-center text-xl font-[500] text-[#FFFFFF]">
                      Claim Failed! Please review your submission and ensure all information is correct.
                    </h1>
                  </div>
                }
              </div>
            }
          </div>
          {isSuccess ?
            <>
              <button
                onClick={handleButtonClick}
                className="mt-8 h-[41px] w-[50%] gap-10 rounded-md border border-white bg-transparent py-2 text-center text-[14px] text-[#FFFFFF] hover:bg-white hover:text-green-500"
              >
                Referral Code
              </button>

              <button
                onClick={closePopUp}
                className="mt-4 h-[41px] w-[50%] gap-10 rounded-md border border-white bg-transparent py-2 text-center text-[14px] text-[#FFFFFF] hover:bg-white hover:text-green-500"
              >
                Close
              </button>
            </>
          : <>
              <button
                onClick={closePopUp}
                className="mt-24 h-[41px] w-[50%] gap-10 rounded-md border border-white bg-transparent py-2 text-center text-[14px] text-[#FFFFFF] hover:bg-white hover:text-green-500"
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
