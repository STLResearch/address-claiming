import React, { useState } from "react";
import { CloseIcon, EarthIcon } from "../Icons";

interface HowToModalProps {
  goBack: () => void;
}

const HowToModal: React.FC<HowToModalProps> = ({ goBack }) => {
  const [section, setSection] = useState<number>(0);

  return (
    <div className="absolute z-50 flex h-screen w-screen flex-col items-center justify-center bg-white">
      <div
        onClick={goBack}
        className="absolute right-[18px] top-[26px] h-[14px] w-[14px]"
      >
        <CloseIcon />
      </div>
      {section === 0 && (
        <div className="flex flex-col items-center justify-center gap-[15px] px-[30px]">
          <div className="h-[72px] w-[72px]">
            <EarthIcon isActive={true} />
          </div>
          <p className="px-[30px] text-center text-[15px] text-[#222222]">
            Ready to claim your airspace? No registered airspace yet, but
            exciting times ahead! 🚀✨
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
          <div className="flex flex-col items-center justify-center py-[30px] text-center">
            {[...Array(6)].map((_, index) => (
              <p key={index} className="text-[15px]">
                <span className="font-bold">{index + 1}. Discover Your Address</span>
                <br />
                Enter your address using the map for accuracy.
              </p>
            ))}
          </div>
          <p className="text-[15px]">
            Let's get started on creating the future and receiving passive
            income from your skies. 🚀✨
          </p>
          <div
            onClick={goBack}
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
            className="h-[14px] w-[14px] cursor-pointer"
            style={{
              background: index !== section ? "#D9D9D9" : "transparent",
              border: index === section ? "1px solid #D9D9D9" : "none",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HowToModal;
