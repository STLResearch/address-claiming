interface PropsI {
  isVisible: boolean;
  errorMessages: string[];
}

const FailurePopUp = ({ isVisible, errorMessages }: PropsI) => {
  return (
    <div
      className={` z-[700] absolute top-[14px] w-[500px] ${isVisible ? "right-0" : "-right-[100%]"} bg-white p-5 flex items-center gap-5 duration-500`}
    >
      🛑
      <div>
        {errorMessages?.length > 0 ? (
          <div>
            {errorMessages?.map((error, index) => (
              <h1 key={index} className="text-black text-base">
                {error}
              </h1>
            ))}
          </div>
        ) : (
          <div>
            {" "}
            Claim Failed! Please review your submission and ensure all
            information is correct.
          </div>
        )}
      </div>
    </div>
  );
};

export default FailurePopUp;
