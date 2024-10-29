import { FC, ReactNode } from "react";
import Link from "next/link";

interface ReferralProgramItemProps {
  icon: ReactNode;
  title: string;
  text: ReactNode;
}

const ReferralProgramItem: FC<ReferralProgramItemProps> = ({ icon, title, text }) => {
  return (
    <div
      className="flex flex-1 flex-col items-center gap-[7.85px] rounded-[30px] bg-white py-[15px] text-center md:px-[38px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div>
        <Link href={"/points"}>{icon}</Link>
      </div>
      <p className="font-semibold text-[#4285F4]">{title}</p>
      <p className="hidden text-center font-normal text-[#1E1E1E] md:block">{text}</p>
    </div>
  );
};

export default ReferralProgramItem;
