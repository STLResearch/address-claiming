import React, { useContext, useEffect, useState } from "react";
import { HistoryArrowIcon } from "../../Icons";
import { Web3authContext } from "@/providers/web3AuthProvider";
import ReferralCodeService from "@/services/ReferralCodeService";
import { useMobile } from "@/hooks/useMobile";

interface ReferralListI {
  description: string;
  date: string;
  amount: string;
  balance: number;
}

const ReferralHistoryTable: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [referralList, setReferralList] = useState<ReferralListI[]>([]);

  const { web3auth } = useContext(Web3authContext);
  const { getReferralHistory } = ReferralCodeService();

  const rowsPerPage = 10;
  const totalPages = Math.ceil(Number(referralCount) / rowsPerPage);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth && web3auth?.status !== "connected") return;
        setLoading(true);

        const respData = await getReferralHistory(rowsPerPage, pageNumber);

        setReferralList(respData.histories);
        setReferralCount(respData.stats._count.point);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, [web3auth?.status, pageNumber]);

  const handleNextPage = () => {
    if (referralList?.length < 9) return;
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handlePrevPage = (page: number) => {
    setPageNumber(page);
  };
  const { isMobile } = useMobile();
  return (
    <div className={`${isMobile ? "history-table-scrollbar" : "overflow-x-scroll"} h-full w-[100%] bg-white`}>
      <table className="w-[582.33px]">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Date</th>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Amount</th>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Description</th>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Balance</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {referralList.map((row, index) => (
            <tr key={index}>
              <td className="py-2 text-[15px] text-[#87878D]">{row.date}</td>
              <td className={`px-4 py-2 ${row.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {row.amount}
              </td>
              <td className="px-4 py-2 text-[15px] text-[#87878D]">{row.description}</td>
              <td className="px-4 py-2 text-[15px] text-[#87878D]">{row.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading ?
        <div className="my-4 flex justify-center gap-4">
          {Array.from({ length: totalPages }, (_, index) => index).map((currentPage) => (
            <button
              key={currentPage}
              onClick={() => handlePrevPage(currentPage)}
              className={`mx-1 flex h-8 w-8 items-center justify-center rounded-full ${currentPage === pageNumber ? "bg-[#5D7285] text-white" : "text-[#5D7285]"}`}
            >
              {currentPage + 1}
            </button>
          ))}
          {referralList?.length >= 9 && (
            <div className="flex items-center justify-center">
              <button
                onClick={handleNextPage}
                className="ml-2 rounded px-3 py-1 text-[#5D7285] hover:bg-[#5D7285] hover:text-white"
              >
                Next
              </button>
              <HistoryArrowIcon />
            </div>
          )}
        </div>
      : <p className="mt-8 text-center">Loading...</p>}
    </div>
  );
};

export default ReferralHistoryTable;
