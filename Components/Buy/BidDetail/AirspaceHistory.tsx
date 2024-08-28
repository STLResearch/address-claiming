import React from "react";
import CustomTable from "./CustomTable";
interface AirspaceHistoryProps {
  airspaceHistory: any;
  totalLifeTimeIncome: number;
  MtdTotalIncome: number;
  WtdTotalIncome: number;
}

const AirspaceHistory: React.FC<AirspaceHistoryProps> = ({
  airspaceHistory,
  totalLifeTimeIncome,
  MtdTotalIncome,
  WtdTotalIncome,
}) => {
  return (
    <div className="">
      <div className="flex flex-wrap flex-row justify-between bg-[#4285F4] bg-opacity-5 rounded-b-[5px]">
        <div className="py-[10px] px-[15px]">
          <div className="text-[#727272] text-[14px] leading-[26px]">
            Lifetime Total Income
          </div>
          <div className="text-[#050505] leading-[26px] font-bold text-[14px]">
            $ {totalLifeTimeIncome}
          </div>
        </div>
        <div className="py-[10px] px-[15px]">
          <div className="text-[#727272] text-[14px] leading-[26px]">
            Total Income MTD
          </div>
          <div className="text-[#050505] leading-[26px] font-bold text-[14px]">
            $ {MtdTotalIncome}
          </div>
        </div>
        <div className="py-[10px] px-[15px]">
          <div className="text-[#727272] text-[14px] leading-[26px]">
            Total Income WTD
          </div>
          <div className="text-[#050505] leading-[26px] font-bold text-[14px]">
            $ {WtdTotalIncome}
          </div>
        </div>
      </div>
      <>
        <CustomTable
          header={["Type", "Date", "From"]}
          auctionBids={airspaceHistory}
        />
      </>
    </div>
  );
};

export default AirspaceHistory;
