import { SuccessIcon,CloseIcon } from "../Icons";
interface PopUpProps {
    isVisible: boolean;
    setShowSuccessPopUp: React.Dispatch<React.SetStateAction<boolean>>;
  }
const PopUp:React.FC<PopUpProps> = ({ isVisible, setShowSuccessPopUp }) => {
    return (
      <div
        className={` z-20 absolute top-[14px] ${isVisible ? "right-0" : "-right-[100%]"} bg-white p-5 flex items-center gap-5 duration-500`}
      >
       <div className="flex items-center justify-center w-5 h-5">
          <SuccessIcon />
        </div>
        Congratulations on claiming your piece of the sky successfully!
        <div className="w-4 h-5 cursor-pointer" onClick={() => setShowSuccessPopUp(false)}>
         <CloseIcon  />
        </div>
      </div>
    );
  };
  export default PopUp;