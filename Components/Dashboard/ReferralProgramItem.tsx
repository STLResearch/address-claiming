import { FC, ReactNode } from "react";
import Link from "next/link";

interface ReferralProgramItemProps {
  icon: ReactNode;
  title: string;
  text: ReactNode;
}

const ReferralProgramItem: FC<ReferralProgramItemProps> = ({
  icon,
  title,
  text,
}) => {
  return (
    <div
      className="py-[15px] flex-1 text-center md:px-[38px] rounded-[30px] bg-white flex flex-col gap-[7.85px] items-center"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div>
        <Link href={"/points"}>{icon}</Link>
      </div>
      <p className="text-[#4285F4] font-semibold text-[12px]">{title}</p>
      <p className="text-[#1E1E1E] font-normal text-xs text-center hidden md:block">
        {text}
      </p>
    </div>
  );
};

export default ReferralProgramItem;
