import { SuccessIcon, CloseIcon } from "../Icons";
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
        className="w-3 h-3 cursor-pointer"
        onClick={() => setShowSuccessPopUp(false)}
      >
        <CloseIcon />
      </div>
    </div>
  );
};

export default SuccessPopUp;
