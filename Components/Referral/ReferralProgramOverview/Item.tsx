import React from "react";
interface ItemProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const Item: React.FC<ItemProps> = ({ icon, title, text }) => {
  return (
    <div
      className="flex w-full flex-col items-center gap-[15px] rounded-[30px] bg-white px-[15px] py-5 md:h-[223px] md:min-w-[225px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex h-12 w-12 items-center justify-center">{icon}</div>
      <p className="text-[18px] font-semibold text-[#4285F4]">{title}</p>
      <p className="text-center text-[14px] font-normal text-[#222222]">{text}</p>
    </div>
  );
};
export default Item;
