import React from "react";
import { SuccessIcon } from "../Icons";
interface PropsI {
  isVisible: boolean;
  setShowSuccessPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessPopUp = ({ isVisible, setShowSuccessPopUp }: PropsI) => {
  return (
    <div
      className={`absolute top-3.5 z-20 ${isVisible ? "right-0" : "-right-[100%]"} flex items-center gap-5 bg-white p-5`}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        <SuccessIcon />
      </div>
      <div className="gap-3 text-base text-light-green">
        Congratulations on claiming your piece of the sky successfully!
      </div>
      <div className="cursor-pointer text-lg font-bold text-light-green" onClick={() => setShowSuccessPopUp(false)}>
        X
      </div>
    </div>
  );
};

export default SuccessPopUp;
