import Image from "next/image";
import React from "react";

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center z-[500] md:z-50">
      <span className="loader">
        {" "}
        <Image
          width={24}
          height={24}
          src={"/images/logo-no-chars.png"}
          alt="img"
          className="mt-2 ml-3"
        />
      </span>
    </div>
  );
};

export default Spinner;
