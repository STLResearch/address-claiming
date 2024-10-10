import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="z-[500] flex flex-col items-center justify-center md:z-50">
      <span className="loader"></span>
    </div>
  );
};

export default Spinner;
