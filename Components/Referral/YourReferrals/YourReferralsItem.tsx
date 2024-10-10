import React from "react";
interface YourReferralsItemProps {
  icon: React.ReactNode;
  number: number;
  text: string;
}
const YourReferralsItem: React.FC<YourReferralsItemProps> = ({ icon, number, text }) => {
  return (
    <div className="flex items-center gap-[17px]">
      <div className="h-[34px] w-[34px]">{icon}</div>
      <p className="min-w-[25.84px] text-center text-[40px] font-semibold text-[#4285F4]">{number}</p>
      <p className="text-[15px] font-normal text-[#868686]">{text}</p>
    </div>
  );
};

export default YourReferralsItem;
