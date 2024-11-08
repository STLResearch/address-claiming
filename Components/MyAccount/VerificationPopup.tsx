import React, { Fragment, useState } from "react";
import Backdrop from "../../Components/Backdrop";
import LoadingButton from "../LoadingButton/LoadingButton";

interface VerificationPopupProps {
  onVerifyMyAccount: () => Promise<void>;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
  onVerifyMyAccount,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleVerify = async () => {
    setIsLoading(true);
   await  onVerifyMyAccount()
    setIsLoading(false)
  };

  return (
    <Fragment>
      {isOpen && (
        <div>
          {<Backdrop onClick={handleClose} />}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="relative w-[465px] h-[379.01px] rounded-[30px] bg-white shadow-lg"
              style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                onClick={handleClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex w-full h-full">
                <div className="md:w-[50%] p-8 flex flex-col justify-center items-center md:gap-6 gap-4">
                  <h1 className="text-xl font-medium text-[#222222] text-center w-56 ">
                    🚀 Attention Air Rights Owner!
                  </h1>
                  <h1 className="text-[12px] font-medium text-[#222222] block md:hidden">
                    Account verification
                  </h1>
                  <p className="text-[12px] font-normal text-[#838187] text-center leading-5 w-[235px]  px-4">
                    Your air rights awaits verification by our operation team.
                    Complete your KYC to expedite the process and ensure swift
                    approval. Plus,{" "}
                    <span className="text-[#87878D] text-[12px] font-bold">
                      earn 10 SKY points
                    </span>{" "}
                    as a token of our appreciation! Don&apos;t delay - verify
                    now and unlock the full potential of your air rights!
                  </p>
                  <LoadingButton
                    onClick={handleVerify}
                    isLoading={isLoading}
                    color="white"
                    className="text-[12px] font-medium w-[180.75px] h-[27.7px] rounded-[3.43px] text-white bg-dark-blue"
                    disable={false}
                  >
                    Verify my identity Now
                  </LoadingButton>
                </div>
                <div className="hidden md:block md:w-[50%]">
                  <img
                    src="/images/portfolio2.png"
                    alt="Verification Image"
                    className="h-full w-full object-cover rounded-r-[30px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default VerificationPopup;
