import React, { useState } from "react";
import { HelpQuestionIcon } from "../Icons";

const Slider = () => {
  const [isFullyVisible, setIsFullyVisible] = useState(false);

  return (
    <div
      onClick={() => setIsFullyVisible((prev) => !prev)}
      className={`fixed cursor-pointer rounded-t-[30px] z-50  ${isFullyVisible ? "bottom-0" : "-bottom-[530px]"} right-6 flex flex-col items-center gap-[34px] py-[43px] px-[23px] bg-white max-w-[362px] duration-5000 z-20`}
    >
      <div className="flex items-center gap-[4px]">
        <div className="flex items-center justify-center w-[24px] h-[24px]">
          <HelpQuestionIcon isActive={false} color={undefined} />
        </div>
        <p className="font-medium text-xl text-[#222222] text-center">
          How to Claim My Airspsace?
        </p>
      </div>
      <div className="flex flex-col px-[6px]">
        <div
          className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]"
          key={1}
        >
          <p className="">1.</p>
          <div className="flex flex-col">
            <p className="font-bold">Discover Your Address</p>
            <p>Enter your address using the map for accuracy.</p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]"
          key={2}
        >
          <p className="">2.</p>
          <div className="flex flex-col">
            <p className="font-bold">Move the Pin If Needed</p>
            <p>Easily adjust the location pin if Google Maps is off.</p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]"
          key={4}
        >
          <p className="">3.</p>
          <div className="flex flex-col">
            <p className="font-bold">Claim Airspace</p>
            <p>
              Click the &lsquo;Claim Airspace&rsquo; button to confirm your
              air rights address. Your Airspace is saved. Modify
              your anytime.
            </p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]"
          key={5}
        >
          <p className="">4.</p>
          <div className="flex flex-col">
            <p className="font-bold">Checking the details</p>
            <p>We confirm official records.</p>
          </div>
        </div>
        <div
          className="flex items-start text-[#222222] font-normal text-[15px] gap-[4px]"
          key={6}
        >
          <p className="">5.</p>
          <div className="flex flex-col">
            <p className="font-bold">Passive income is on the way</p>
            <p>We will update you as your account receives funds.</p>
          </div>
        </div>
      </div>
      <div className="font-normal text-[15px] text-[#222222] text-center">
        Let&apos;s get started on creating the future and receiving passive
        income from your skies. 🚀✨
      </div>
    </div>
  );
};

export default Slider;
