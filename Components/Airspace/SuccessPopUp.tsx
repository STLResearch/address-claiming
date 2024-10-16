import React from "react";
import { SuccessIcon } from "../Icons";
interface PropsI {
  isVisible: boolean;
  setShowSuccessPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessPopUp = ({ isVisible, setShowSuccessPopUp }: PropsI) => {
  return (
    <div
      className={` z-20 absolute top-3.5 ${isVisible ? "right-0" : "-right-[100%]"} bg-white p-5 flex items-center gap-5`}
    >
      <div className="flex items-center justify-center w-5 h-5">
        <SuccessIcon />
      </div>
      <div className="text-light-green text-base gap-3">
        Congratulations on claiming your piece of the sky successfully!
      </div>
      <div
        className=" cursor-pointer text-light-green text-lg font-bold"
        onClick={() => setShowSuccessPopUp(false)}
      >
        X
      </div>
    </div>
  );
};

export default SuccessPopUp;
