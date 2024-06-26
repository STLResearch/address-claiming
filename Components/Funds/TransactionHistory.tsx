import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '../../Components/Icons';
import { useMobile } from '@/hooks/useMobile';
import {TransactionHistoryProps } from '../../types';

const TransactionHistory = ({ transactions, user }:TransactionHistoryProps) => {
    const { isMobile } = useMobile();
      const [currentPage, setCurrentPage] = useState(1);
      const TRANSACTIONS_PER_PAGE = 8;
      const initialIndex = (currentPage - 1) * TRANSACTIONS_PER_PAGE;
      const finalIndex = currentPage * TRANSACTIONS_PER_PAGE;
      const paginatedData = transactions.slice(initialIndex, finalIndex);
      const totalPages = Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE);
    
      useEffect(() => {
        setCurrentPage(1);
      }, [transactions]);
    
      const changePage = (newPage) => setCurrentPage(newPage);
      const getPaginationNumbers = () => {
        const pages: number[] = [];
        const range = 2;
        
    
        for (let i = currentPage - range; i <= currentPage + range; i++) {
          if (i > 0 && i <= totalPages) {
            pages.push(i);
          }
        }
    
        return pages;
      };
    
      return (
        <div className="flex flex-col  gap-5 flex-1 min-w-[89%] sm:min-w-[600px]">
          <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-center">
            <p className="font-medium text-xl pt-[14px] pb-[14px] sm:p-0 text-[#222222] w-[89%] ">
              Transaction History
            </p>
            <div
              className="relative px-[22px] py-[16px] bg-white w-[89%] sm:w-[272px] rounded-lg"
              style={{ border: "1px solid #87878D" }}
            >
              <input
                type="text"
                name="searchTransactions"
                id="searchTransactions"
                placeholder="Search Transactions"
                className="outline-none w-full pr-[20px]"
              />
              <div className="w-[17px] h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
                <MagnifyingGlassIcon />
              </div>
            </div>
          </div>
          <div
          className={`flex justify-center overflow-y-auto fund-table-scrollbar
          ${paginatedData?.length > 0 ? "h-[300px]" : "h-auto"} 
          sm:h-[80%] fund-table-scrollbar`}
          style={{ direction: `${isMobile ? "rtl" : "ltr"}` }}
          >
            <div style={{direction: "ltr"}} className="w-[89%] sm:w-[100%] " >
              <div className="overflow-x-auto fund-table-scrollbar">
    
              <table className="w-[100%]" >
                <thead className="sticky top-0 z-10 bg-white sm:bg-[#F6FAFF] opacity-100 text-[#7D90B8] uppercase text-sm font-bold tracking-[0.5px]">
                  <tr className="w-full">
                {["date", "transaction id", "type", "amount", "status"].map(
                  (th,index) => (
                    <th key={index} className="whitespace-nowrap text-start py-5 px-5 !w-[50%] min-w-[120px] sm:w-[20%]">{th}</th>
                  )
                )}
                  </tr>
                </thead>
              <tbody>
    
              {paginatedData.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#F0F4FA] sm:bg-[#F6FAFF]"} !rounded-lg`}
                >
                  <td className={`py-6 px-2 rounded-l-lg text-[#222222]   text-start w-[200px] min-w-[120px] sm:w-[20%] `}>
                    {transaction.date}
                  </td>
                  <td className={`py-6 px-2 text-[#222222]  text-clip text-start w-1/2 min-w-[120px] sm:w-[20%] `}>
                    <a
                      className=""
                      target="_blank"
                      href={`https://explorer.solana.com/tx/${transaction.transHash}`}
                    >
                      {transaction.hash}
                    </a>
                  </td>
                  <td className={`py-6 px-2 text-[#222222]  text-start  w-1/2 min-w-[120px] sm:w-[20%] `}>
                    {transaction?.destination !== user?.blockchainAddress
                      ? "withdraw"
                      : "deposit"}
                  </td>
                  <td className={`py-6 px-2 text-[#222222]  text-start w-1/2 min-w-[120px] sm:w-[20%] `}>
                    ${transaction.amount / 1000000}
                  </td>
                  <td className={`py-6 px-2 rounded-r-lg text-[#222222] text-center sm:text-startw-1/2 min-w-[120px] sm:w-[20%] `}>
                    {transaction.status}
                  </td>
                </tr>
              ))} 
            </tbody>
          </table>
          </div>
    
          <div className="flex items-center justify-end">
            <div className="mx-auto flex gap-[11.71px]">
              {getPaginationNumbers().map((pageNumber) => (
                <div
                  className={`${currentPage === pageNumber ? "text-[#87878D]" : "text-[#0653EA] cursor-pointer"} text-base font-bold`}
                  key={pageNumber}
                  onClick={() => changePage(pageNumber)}
                >
                  {pageNumber}
                </div>
              ))}
              {totalPages > 1 && (
                <div
                  className={`${currentPage === totalPages ? "text-[#87878D]" : "text-[#0653EA] cursor-pointer"} text-base font-normal`}
                  onClick={() => {
                    if (currentPage !== totalPages) changePage(currentPage + 1);
                  }}
                >
                  Next
                </div>
              )}
            </div>
            {totalPages !== 0 && (
              <div className="text-[#87878D] text-[14px] font-normal -tracking-[0.5px]">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>
          </div>
          </div>
    
        </div>
      );
    };
    export default TransactionHistory;