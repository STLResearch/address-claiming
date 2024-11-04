import { FC, ReactNode } from "react";
import Link from "next/link";

interface ItemProps {
  children: ReactNode;
  title: ReactNode;
  icon: ReactNode;
  linkText: string;
  href: string;
  style?: string;
}

const Item: FC<ItemProps> = ({ children, title, icon, linkText, href, style }) => {
  return (
    <div
      className={`${style || ""} relative flex w-full flex-col gap-[15px] rounded-[30px] bg-white pb-[21px] pl-[25px] pr-[18px] pt-[17px] md:w-[443px] lg:w-[500px]`}
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium text-[#222222]">{title} </p>
        <Link href={href}>
          <div className="float" style={{ borderRadius: "50%" }}>
            {icon}
          </div>
        </Link>
      </div>
      {children}
      <Link href={href}>
        <p className="cursor-pointer text-right text-base font-medium text-[#0653ea]">{linkText}</p>
      </Link>
    </div>
  );
};

export default Item;
