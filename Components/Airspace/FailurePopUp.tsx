interface FailurePopUpProps {
    isVisible: boolean;
  }
const FailurePopUp: React.FC<FailurePopUpProps> = ({ isVisible }) => {
    return (
      <div
        className={` z-20 absolute top-[14px] ${isVisible ? "right-0" : "-right-[100%]"} bg-white p-5 flex items-center gap-5 duration-500`}
      >
        🛑 Claim Failed! Please review your submission and ensure all information
        is correct.
      </div>
    );
  };
  export default FailurePopUp;