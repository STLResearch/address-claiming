import { GiftIcon } from "@/Components/Icons";
import { BalanceLoader } from "@/Components/Wrapped";
import { FC } from "react";

interface PropsI {
  point: string | null;
  isLoading: boolean;
}

const PointBalance: FC<PropsI> = ({ point, isLoading }) => {
  return (
    <div className="w-full md:w-w-1/2 px-4 md:px-8">
      <div
        className="py-5 px-4 md:px-6 rounded-[30px] bg-white w-full shadow-xl"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="flex items-center ">
          <div className=" h-4 ml-auto">
            <GiftIcon isActive={true} />
          </div>
        </div>
        <div className="text-xl md:text-xl font-semibold mt-4">
          SKY Points Balance
        </div>
        <div className="mt-9 mb-4">
          {isLoading ? (
            <div className=" md:h-14 flex justify-start items-center">
              <BalanceLoader />
            </div>
          ) : (
            <div className="text-blue-500 font-semibold text-xl md:text-xl ">
              {point} SKY Points
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointBalance;
