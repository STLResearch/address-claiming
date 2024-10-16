import { useRouter } from "next/navigation";
import { CircledCloseIcon, SuccessIconwhite } from "../Icons";

interface PropsI {
  closePopUp: () => void;
  isSuccess: boolean;
  errorMessages: string[];
}

const SuccessModal = ({ closePopUp, isSuccess, errorMessages }: PropsI) => {
  const router = useRouter();
  const handleButtonClick = () => {
    router.push("/points");
  };

  return (
    <div className="claim-modal-step fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:rounded-[30px] w-full max-h-screen h-screen md:max-h-[640px] md:h-auto overflow-y-auto overflow-x-auto md:w-[689px] z-50 flex flex-col gap-[15px] ">
      <div
        className={`w-[100%] h-screen   ${isSuccess ? "bg-[#34A853]" : "bg-[#F5AA5E]"}`}
      >
        <div
          className={`px-8 flex-col  items-center flex justify-center w-full h-full `}
        >
          <div className="w-16 h-16 mt-6">
            {isSuccess ? <SuccessIconwhite /> : <CircledCloseIcon />}
          </div>
          <div>
            {isSuccess ? (
              <div className="mt-8">
                <h1 className="mt-6 px-8 font-[500]  text-xl text-center text-[#FFFFFF] font-poppins">
                  Congratulations on claiming your piece of the sky successfully
                  !
                </h1>
                <p className="mt-6 px-10 font-[300] text-[15px] text-center text-[#FFFFFF] font-poppins">
                  To make additional income and credits, refer your friends and
                  colleagues by revealing your referral code below.
                </p>
              </div>
            ) : (
              <div className="mt-20">
                {errorMessages?.length > 0 ? (
                  <>
                    {errorMessages?.map((error, index) => (
                      <h1
                        key={index}
                        className=" px-6 font-[500]  text-xl text-center text-[#FFFFFF] font-poppins"
                      >
                        {error}
                      </h1>
                    ))}
                  </>
                ) : (
                  <div className="border-2">
                    <h1 className=" px-6 font-[500]  text-xl text-center text-[#FFFFFF] font-poppins">
                      Claim Failed! Please review your submission and ensure all
                      information is correct.
                    </h1>
                  </div>
                )}
              </div>
            )}
          </div>
          {isSuccess ? (
            <>
              <button
                onClick={handleButtonClick}
                className="mt-8 py-2 w-[50%] h-[41px] border rounded-md gap-10 text-center text-[#FFFFFF] text-[14px] bg-transparent border-white hover:bg-white hover:text-green-500"
              >
                Referral Code
              </button>

              <button
                onClick={closePopUp}
                className="mt-4 py-2 w-[50%] h-[41px] border rounded-md gap-10 text-center text-[#FFFFFF] text-[14px] bg-transparent border-white hover:bg-white hover:text-green-500"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={closePopUp}
                className="mt-24 py-2 w-[50%] h-[41px] border rounded-md gap-10 text-center text-[#FFFFFF] text-[14px] bg-transparent border-white hover:bg-white hover:text-green-500"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
