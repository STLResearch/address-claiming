import { GiftIcon } from "@/Components/Icons";
import { BalanceLoader } from "@/Components/Wrapped";
import { FC } from "react";

interface PropsI {
  point: string | null;
  isLoading: boolean;
}

const PointBalance: FC<PropsI> = ({ point, isLoading }) => {
  return (
    <div className="md:w-w-1/2 w-full px-4 md:px-8">
      <div
        className="w-full rounded-[30px] bg-white px-4 py-5 shadow-xl md:px-6"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="flex items-center">
          <div className="ml-auto h-4">
            <GiftIcon isActive={true} />
          </div>
        </div>
        <div className="mt-4 text-xl font-semibold md:text-xl">SKY Points Balance</div>
        <div className="mb-4 mt-9">
          {isLoading ?
            <div className="flex items-center justify-start md:h-14">
              <BalanceLoader />
            </div>
          : <div className="text-xl font-semibold text-blue-500 md:text-xl">{point} SKY Points</div>}
        </div>
      </div>
    </div>
  );
};

export default PointBalance;
