import React, { useContext, useEffect, useState } from "react";
import { HistoryArrowIcon } from "../../Icons";
import { Web3authContext } from "@/providers/web3authProvider";
import ReferralCodeService from "@/services/ReferralCodeService";

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

  return (
    <div className=" w-[100%] overflow-x-scroll h-full bg-white">
      <table className=" w-[582.33px]">
        <thead className="">
          <tr>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Date</th>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Amount</th>
            <th className="px-4 py-2 text-[15px] text-[#222222]">
              Description
            </th>
            <th className="px-4 py-2 text-[15px] text-[#222222]">Balance</th>
          </tr>
        </thead>
        <tbody className="text-center ">
          {referralList.map((row, index) => (
            <tr key={index}>
              <td className="py-2 text-[#87878D] text-[15px]">{row.date}</td>
              <td
                className={`px-4 py-2 ${row.amount.startsWith("+") ? "text-green-500" : "text-red-500"}`}
              >
                {row.amount}
              </td>
              <td className="px-4 py-2 text-[#87878D] text-[15px]">
                {row.description}
              </td>
              <td className="px-4 py-2 text-[#87878D] text-[15px]">
                {row.balance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading ? (
        <div className="flex justify-center my-4 gap-4">
          {Array.from({ length: totalPages }, (_, index) => index).map(
            (currentPage) => (
              <button
                key={currentPage}
                onClick={() => handlePrevPage(currentPage)}
                className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${currentPage === pageNumber ? "bg-[#5D7285] text-white" : "text-[#5D7285]"}`}
              >
                {currentPage + 1}
              </button>
            ),
          )}
          <div className="flex justify-center items-center">
            <button
              onClick={handleNextPage}
              disabled={referralList?.length < 9}
              className="ml-2 px-3 py-1 rounded text-[#5D7285]"
            >
              Next
            </button>
            <HistoryArrowIcon />
          </div>
        </div>
      ) : (
        <p className="text-center mt-8">Loading...</p>
      )}
    </div>
  );
};

export default ReferralHistoryTable;
