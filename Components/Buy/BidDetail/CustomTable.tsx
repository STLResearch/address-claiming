import React from "react";
import { shortenAddress } from "@/utils";

interface CustomTableProps {
  header: string[];
  auctionBids:
    | {
        id: number;
        price: number;
        bidder: string;
        transaction: string;
        auctionId: number;
      }[]
    | undefined;
}
const CustomTable: React.FC<CustomTableProps> = ({ header, auctionBids }) => {
  return (
    <div className="my-[15px] flex min-w-[89%] flex-1 flex-col sm:min-w-[600px]">
      <div className="thin-scrollbar thin-scrollbar flex justify-center overflow-y-auto sm:h-[80%]">
        <div className="w-[89%] sm:w-[100%]">
          <div className="thin-scrollbar flex flex-col overflow-x-auto">
            <table className="w-[100%]">
              <thead className="sticky top-0 z-[500] bg-white text-sm font-bold uppercase tracking-[0.5px] text-[#7D90B8] opacity-100">
                <tr className="w-full py-[15px]">
                  {header.map((th, index) => (
                    <th
                      key={index}
                      className="!w-[28%] min-w-[120px] whitespace-nowrap px-2 text-start text-sm font-bold sm:w-[20%]"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auctionBids &&
                  auctionBids.map((transaction, index) => (
                    <tr
                      key={transaction.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-[#F0F4FA] sm:bg-[#F6FAFF]"} !rounded-lg`}
                    >
                      <td
                        className={`w-[28%] min-w-[120px] rounded-lg px-2 py-[6px] text-start text-[16px] leading-5 text-[#222222] sm:w-[20%]`}
                      >
                        {transaction?.price}
                      </td>

                      <td
                        className={`w-[28%] min-w-[120px] rounded-r-lg px-2 py-[6px] text-center text-[16px] leading-5 text-[#222222] sm:w-[20%] sm:text-start`}
                      >
                        {shortenAddress(transaction?.bidder, 5)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomTable;
