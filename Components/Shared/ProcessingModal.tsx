import Spinner from "../Spinner";

const ProcessingModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#294B63] bg-opacity-50 py-32 backdrop-blur-[2px]">
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
};

export default ProcessingModal;
