import React from "react";
import Image from "next/image";

const LoadingMessage: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center gap-[21.5px] overflow-hidden rounded bg-[#F6FAFF] max-sm:bg-[white]">
      <div
        className="relative mx-auto flex flex-col items-center justify-center gap-[15px] rounded bg-white px-[30px] py-[40px]"
        style={{ maxWidth: "449px" }}
      >
        <Image
          src={"/images/logo-1.svg"}
          alt="Company's logo"
          width={199}
          height={77}
        />
        <p className="mt-[25px] text-xl font-medium text-light-black">
          Welcome to SkyTrade
        </p>
        <p className="text-center text-[14px] font-normal text-light-grey">
          Thanks for waiting. We're moving you to a new page. Please don't
          refresh while we do this.
        </p>
      </div>
    </div>
  );
};

export default LoadingMessage;
