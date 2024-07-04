import Image from "next/image";
import Spinner from "../Spinner";

const ProcessingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-start py-32 justify-center bg-[#294B63] bg-opacity-50 backdrop-blur-[2px]	">
      <div>
        <Spinner />
      </div>
    </div>
  );
};

export default ProcessingModal;
