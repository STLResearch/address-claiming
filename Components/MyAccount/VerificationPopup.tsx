import React, { Fragment, useState } from "react";
import Backdrop from "../../Components/Backdrop";

interface VerificationPopupProps {
  onVerifyMyAccount: () => void;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({ onVerifyMyAccount }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      {isOpen && (
        <div>
          {<Backdrop onClick={handleClose} />}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="relative h-[600px] w-[800px] rounded-[30px] bg-white shadow-lg"
              style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
            >
              <button className="absolute right-4 top-4 text-gray-400 hover:text-gray-600" onClick={handleClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex h-full w-full">
                <div className="flex flex-col items-center justify-center gap-4 p-8 md:w-[50%] md:gap-6">
                  <h1 className="w-56 text-center text-xl font-medium text-[#222222]">🚀 Attention Airspace Owner!</h1>
                  <h1 className="block text-xl font-medium text-[#222222] md:hidden">Account verification</h1>
                  <p className="w-[235px] text-center text-base font-normal leading-7 text-[#838187]">
                    Your airspace awaits verification by our operation team. Complete your KYC to expedite the process
                    and ensure swift approval. Plus,{" "}
                    <span className="text-base font-bold text-[#87878D]">earn 10 SKY points</span> as a token of our
                    appreciation! Don&apos;t delay - verify now and unlock the full potential of your airspace!
                  </p>
                  <button
                    onClick={onVerifyMyAccount}
                    className="w-[235px] bg-dark-blue px-6 py-3 text-base font-medium text-white"
                  >
                    Verify my identity Now
                  </button>
                </div>
                <div className="hidden md:block md:w-[50%]">
                  <img
                    src="/images/portfolio2.png"
                    alt="Verification Image"
                    className="h-full w-full rounded-r-[30px] object-cover"
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
