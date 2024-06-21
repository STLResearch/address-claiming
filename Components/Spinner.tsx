import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center z-[600] md:z-50">
      <span className="loader"></span>
    </div>
  );
};

export default Spinner;
