import { FC, ReactNode } from "react";
import Link from "next/link";

interface ItemProps {
  title: ReactNode;
  icon: ReactNode;
  href: string;
  style?: string;
}

const Item: FC<ItemProps> = ({
  title,
  icon,
  href,
  style,
}) => {
  return (
    <div
      className={`${style || ""} relative flex flex-col pt-[17px] pb-[21px] pr-[18px] pl-[25px] rounded-[30px] bg-white gap-[15px] md:w-[343px] w-full`}
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex justify-between items-center">
        <p className="text-xl font-medium text-[#222222]">{title} </p>
        <Link
          href={href}>
          <div className="h-10 w-10">{icon}</div>
        </Link>
      </div>
    </div>
  );
};

export default Item;

