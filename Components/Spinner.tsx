import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center z-[500] md:z-50">
      <span className="loader"></span>
    </div>
  );
};

export default Spinner;
