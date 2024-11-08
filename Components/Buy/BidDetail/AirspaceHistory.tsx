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
      <div className="flex flex-row flex-wrap justify-between rounded-b-[5px] bg-[#4285F4] bg-opacity-5">
        <div className="px-[15px] py-[10px]">
          <div className="text-[14px] leading-[26px] text-[#727272]">Lifetime Total Income</div>
          <div className="text-[14px] font-bold leading-[26px] text-[#050505]">$ {totalLifeTimeIncome}</div>
        </div>
        <div className="px-[15px] py-[10px]">
          <div className="text-[14px] leading-[26px] text-[#727272]">Total Income MTD</div>
          <div className="text-[14px] font-bold leading-[26px] text-[#050505]">$ {MtdTotalIncome}</div>
        </div>
        <div className="px-[15px] py-[10px]">
          <div className="text-[14px] leading-[26px] text-[#727272]">Total Income WTD</div>
          <div className="text-[14px] font-bold leading-[26px] text-[#050505]">$ {WtdTotalIncome}</div>
        </div>
      </div>
      <>
        <CustomTable header={["Type", "Date", "From"]} auctionBids={airspaceHistory} />
      </>
    </div>
  );
};

export default AirspaceHistory;
