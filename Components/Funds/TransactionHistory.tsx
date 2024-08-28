import React, { useState, useEffect, useContext } from "react";
import { MagnifyingGlassIcon, RefreshIcon } from "../../Components/Icons";
import { useMobile } from "@/hooks/useMobile";
import { Connection, PublicKey } from "@solana/web3.js";
import moment from "moment";
import Link from "next/link";
import { Web3authContext } from "@/providers/web3authProvider";
import useAuth from "@/hooks/useAuth";
import { formatNumber } from "@/utils";

interface TransactionListI {
  time: string;
  transactionHash: string;
  type: string;
  firstTransactionSignature: string;
  lastTransactionSignature: string;
  difference: string | number;
}

export interface TransactionHistoryPropsI {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const TransactionHistory = ({
  isLoading,
  setIsLoading,
}: TransactionHistoryPropsI) => {
  const limit: number = 10;
  const targetRpcUrl = process.env.NEXT_PUBLIC_RPC_TARGET as string;
  const minterAddress = process.env.NEXT_PUBLIC_MINT_ADDRESS as string;
  const rentalFeePublicKey = "HmqstutaEpbddgt5hjhJAsnrXhTUfQpveCpyWEvEdnWM";

  const { web3auth } = useContext(Web3authContext);
  const { isMobile } = useMobile();
  const { user } = useAuth();

  const [isNext, setIsNext] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [transactionList, setTransactionList] = useState<TransactionListI[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if ((web3auth && web3auth?.status !== "connected") || !user) return;
        setIsLoading(true);
        const connection = new Connection(targetRpcUrl);
        const blockchainAddress = user?.blockchainAddress;
        let options = {};

        const lastTxHash =
          transactionList.length > 0
            ? transactionList.at(-1)?.lastTransactionSignature
            : "";
        if (isNext) {
          options = {
            limit,
            ...(lastTxHash && { before: lastTxHash }),
          };
        } else {
          const firstTxHash =
            transactionList.length > 0
              ? transactionList.at(-1)?.firstTransactionSignature
              : "";

          options = {
            ...(firstTxHash && { until: firstTxHash }),
          };
        }
        const tokenAcc = await connection.getTokenAccountsByOwner(
          new PublicKey(user?.blockchainAddress as string),
          { mint: new PublicKey(minterAddress) }
        );
        const _txs = await connection.getSignaturesForAddress(
          new PublicKey(`${tokenAcc.value[0].pubkey.toString()}`),
          options
        );
        const txs = _txs.slice(-limit);
        const signatureList = txs.map((transaction) => transaction.signature);
        const transactionDetails = await connection.getParsedTransactions(
          signatureList,
          { maxSupportedTransactionVersion: 0 }
        );
        const data = transactionDetails?.map((item, idx) => {
          const preTokenBalObject = item?.meta?.preTokenBalances?.filter(
            (item) => {
              return (
                item.owner == blockchainAddress && item.mint == minterAddress
              );
            }
          );
          const postTokenBalObject = item?.meta?.postTokenBalances?.filter(
            (item) => {
              return (
                item.owner == blockchainAddress && item.mint == minterAddress
              );
            }
          );
          let difference = 0;
          if (preTokenBalObject || postTokenBalObject) {
            if (
              preTokenBalObject &&
              preTokenBalObject.length > 0 &&
              postTokenBalObject &&
              postTokenBalObject.length > 0
            ) {
              difference =
                (postTokenBalObject[0]?.uiTokenAmount?.uiAmount as number) -
                (preTokenBalObject[0]?.uiTokenAmount?.uiAmount as number);
            } else if (
              (!preTokenBalObject || preTokenBalObject.length <= 0) &&
              postTokenBalObject
            ) {
              difference = postTokenBalObject[0]?.uiTokenAmount
                ?.uiAmount as number;
            } else if (preTokenBalObject && preTokenBalObject.length > 0) {
              difference = preTokenBalObject[0]?.uiTokenAmount
                ?.uiAmount as number;
            }
          }
          difference = parseFloat(difference.toPrecision(5));
          let type = difference > 0 ? "Deposit" : "Withdraw";

          item?.transaction.message.accountKeys?.forEach((item) => {
            if (item.pubkey.toString() === rentalFeePublicKey) {
              type = "Rental Fee";
            }
          });

          return {
            time: moment.unix(item?.blockTime as number).format("MMM D, YYYY"),
            transactionHash: signatureList[idx],
            type,
            difference:
              difference.toString() == "NaN"
                ? "1st transaction"
                : formatNumber(difference),
            firstTransactionSignature: signatureList[0],
            lastTransactionSignature: signatureList[signatureList.length - 1],
          };
        });

        setTransactionList(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
  }, [web3auth?.status, pageNumber, user?.blockchainAddress, isNext]);

  const handleNextPage = () => {
    if (transactionList?.length < limit - 1) return;
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    setIsNext(true);
  };

  const handlePrevPage = () => {
    if (pageNumber === 1) return;
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
    setIsNext(false);
  };

  const handleReset = () => {
    setPageNumber(1);
    setIsNext(true);
  };

  const renderTransactionRows = () => {
    if (!transactionList || !Array.isArray(transactionList)) {
      return null;
    }

    const trimmedSearchQuery = searchQuery.toLowerCase().trim();

    // Filter transactions based on search query
    const filteredTransactions = trimmedSearchQuery
      ? transactionList.filter(
          (transaction) =>
            transaction.transactionHash
              .toLowerCase()
              .includes(trimmedSearchQuery) ||
            transaction.difference
              .toString()
              .toLowerCase()
              .includes(trimmedSearchQuery) ||
            transaction.time
              .toString()
              .toLowerCase()
              .includes(trimmedSearchQuery) ||
            transaction.type
              .toString()
              .toLowerCase()
              .includes(trimmedSearchQuery)
        )
      : transactionList;

    return filteredTransactions.map((item) => (
      <tr key={item.transactionHash}>
        <td className="py-6 text-[#222222] px-5 w-2/12 whitespace-nowrap">
          {item.time}
        </td>
        <td className="py-6 text-[#222222] text-clip px-5 w-2/12 underline whitespace-nowrap">
          <Link
            href={`https://explorer.solana.com/tx/${item.transactionHash}`}
            target="_blank"
          >
            {item.transactionHash.substring(0, 25)}
          </Link>
        </td>
        <td className="py-6 text-[#222222] px-5 w-2/12 whitespace-nowrap">
          {item.type}
        </td>
        <td className="py-6 text-[#222222] px-5 w-2/12 whitespace-nowrap">
          {item.difference}
        </td>
        <td className="py-6 text-[#222222] px-5 w-2/12 whitespace-nowrap">
          Settled
        </td>
      </tr>
    ));
  };

  return (
    <div className="flex flex-col gap-5 flex-1 min-w-[89%] sm:min-w-[600px]">
      <div className="md:flex sm:flex-col md:flex-row justify-start sm:justify-between items-center">
        <p className="flex font-medium text-xl pt-[14px] md:px-0 px-2 pb-[14px] sm:p-0 text-[#222222] w-[89%] ">
          Transaction History
        </p>
        <div className="flex md:px-0 px-2 justify-end items-center md:w-full ">
          <div
            className="relative px-[22px] md:py-[16px] py-3 bg-white rounded-lg"
            style={{ border: "1px solid #87878D" }}
          >
            <input
              type="text"
              name="searchTransactions"
              id="searchTransactions"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Transactions"
              className="outline-none w-full pr-[20px]"
            />
            <div className="w-[17px] cursor-pointer h-[17px] absolute top-1/2 -translate-y-1/2 right-[22px]">
              <MagnifyingGlassIcon />
            </div>
          </div>
          <div
            className="w-12 h-12 md:h-12  md:w-12 cursor-pointer  bg-[#0653EA] text-center font-medium ml-5 p-1 rounded-md"
            onClick={handleReset}
          >
            <RefreshIcon />
          </div>
        </div>
      </div>
      <div
        className={`flex justify-center overflow-y-auto md:overflow-y-hidden fund-table-scrollbar h-auto md:h-`}
        style={{ direction: `${isMobile ? "rtl" : "ltr"}` }}
      >
        <div style={{ direction: "ltr" }} className="w-[89%] sm:w-[100%]">
          <div className="overflow-x-auto md:overflow-x-hidden fund-table-scrollbar">
            <table className="w-[100%] fund-table">
              <thead className="sticky top-0 bg-white sm:bg-[#F6FAFF] opacity-100 text-[#7D90B8] uppercase text-sm font-bold tracking-[0.5px]">
                <tr className="w-full">
                  <th className="text-start py-5 px-5">Date</th>
                  <th className="text-start py-5 px-5">Transaction Id</th>
                  <th className="text-start py-5 px-5">Type</th>
                  <th className="text-start py-5 px-5">Amount</th>
                  <th className="py-5 px-5 text-start">Status</th>
                </tr>
              </thead>
              <tbody>{renderTransactionRows()}</tbody>
            </table>
            <div className="flex items-center justify-end mt-8 w-[94%]">
              <div className="mx-auto flex gap-[11.71px]">
                <div className={` text-[#87878D] text-base font-normal`}>
                  {transactionList.length === 0 &&
                    !isLoading &&
                    "No transactions found."}
                </div>
              </div>
              {transactionList.length > 0 && (
                <>
                  <div
                    onClick={handlePrevPage}
                    className={`${pageNumber === 1 ? "text-[#87878D] cursor-not-allowed" : "text-[#0653EA] cursor-pointer"} text-base font-normal mx-5`}
                  >
                    Previous
                  </div>
                  <div
                    className={`${transactionList.length < limit - 1 ? "text-[#87878D] cursor-not-allowed" : "text-[#0653EA] cursor-pointer"} text-base font-normal mx-1`}
                    onClick={handleNextPage}
                  >
                    Next
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
