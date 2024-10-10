import React, { useState } from "react";
import { CloseIcon, EarthIcon } from "../Icons";

interface PropsI {
  goBack: () => void;
  handleOpenAirspaceMap: () => void;
}

const stepsData = [
  {
    title: "Discover Your Address",
    description: "Enter your address using the map for accuracy.",
  },
  {
    title: "Move the Pin If Needed",
    description: "Easily adjust the location pin if Google Maps is off.",
  },
  {
    title: "Claim Airspace",
    description:
      "Click the 'Claim Airspace' button to confirm your airspace address. Your Airspace is saved. Modify your details anytime.",
  },
  {
    title: "Checking the details",
    description: "We confirm official records.",
  },
  {
    title: "Passive income is on the way",
    description: "We will update you as your account receives funds.",
  },
];

const Step = ({ number, title, description }) => (
  <p className="w-full text-left text-[15px]">
    <span className="font-bold">
      {number}. {title}
    </span>
    <br />
    {description}
  </p>
);

const HowToModal = ({ goBack, handleOpenAirspaceMap }: PropsI) => {
  const [section, setSection] = useState(0);
  return (
    <div className="absolute z-50 flex h-screen w-screen flex-col items-center justify-center bg-white">
      <div onClick={goBack} className="absolute right-[18px] top-[26px] h-[14px] w-[14px]">
        <CloseIcon />
      </div>
      {section === 0 && (
        <div className="flex flex-col items-center justify-center gap-[15px] px-[30px]">
          <div className="h-[72px] w-[72px]">
            <EarthIcon isActive={true} />
          </div>
          <p className="px-[30px] text-center text-[15px] text-[#222222]">
            Ready to claim your airspace? No registered airspace yet, but exciting times ahead! 🚀✨
          </p>
          <div
            onClick={() => setSection(1)}
            className="w-full cursor-pointer rounded-[8px] bg-[#0653EA] py-[16px] text-center text-white"
          >
            Next
          </div>
        </div>
      )}
      {section === 1 && (
        <div className="flex flex-col items-center justify-center gap-[15px] px-[60px] text-center text-[#222222]">
          <p className="text-[20px] font-medium">How to Claim My Airspace?</p>
          <div className="flex-start flex flex-col items-center py-[30px] text-left">
            {stepsData.map((step, index) => (
              <Step key={index} number={index + 1} title={step.title} description={step.description} />
            ))}
          </div>
          <p className="text-[15px]">
            Let&apos;s get started on creating the future and receiving passive income from your skies. 🚀✨
          </p>

          <div
            onClick={handleOpenAirspaceMap}
            className="w-full cursor-pointer rounded-[8px] bg-[#0653EA] py-[16px] text-center text-white"
          >
            Claim Airspace
          </div>
        </div>
      )}
      <div className="mt-[15px] flex items-center justify-center gap-[11px] pt-5">
        {[0, 1].map((_, index) => (
          <div
            key={index}
            onClick={() => setSection(index)}
            className={`h-[14px] w-[14px] cursor-pointer rounded-full ${index !== section ? "none bottom-3 border border-[#D9D9D9] bg-transparent" : "bg-[#D9D9D9]"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HowToModal;
