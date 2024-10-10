import React, { useState, useEffect, useContext } from "react";
import { MagnifyingGlassIcon, RefreshIconTransaction } from "../../Components/Icons";
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

const TransactionHistory = () => {
  const limit: number = 10;
  const targetRpcUrl = process.env.NEXT_PUBLIC_RPC_TARGET as string;
  const minterAddress = process.env.NEXT_PUBLIC_MINT_ADDRESS as string;
  const rentalFeePublicKey = "HmqstutaEpbddgt5hjhJAsnrXhTUfQpveCpyWEvEdnWM";
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { web3auth } = useContext(Web3authContext);
  const { isMobile } = useMobile();
  const { user } = useAuth();

  const [isNext, setIsNext] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [transactionList, setTransactionList] = useState<TransactionListI[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if ((web3auth && web3auth?.status !== "connected") || !user) return;
        setIsLoading(true);
        const connection = new Connection(targetRpcUrl);
        const blockchainAddress = user?.blockchainAddress;
        let options = {};

        const lastTxHash = transactionList.length > 0 ? transactionList.at(-1)?.lastTransactionSignature : "";
        if (isNext) {
          options = {
            limit,
            ...(lastTxHash && { before: lastTxHash }),
          };
        } else {
          const firstTxHash = transactionList.length > 0 ? transactionList.at(-1)?.firstTransactionSignature : "";

          options = {
            ...(firstTxHash && { until: firstTxHash }),
          };
        }
        const tokenAcc = await connection.getTokenAccountsByOwner(new PublicKey(user?.blockchainAddress as string), {
          mint: new PublicKey(minterAddress),
        });
        const _txs = await connection.getSignaturesForAddress(
          new PublicKey(`${tokenAcc.value[0].pubkey.toString()}`),
          options
        );
        const txs = _txs.slice(-limit);
        const signatureList = txs.map((transaction) => transaction.signature);
        const transactionDetails = await connection.getParsedTransactions(signatureList, {
          maxSupportedTransactionVersion: 0,
        });
        const data = transactionDetails?.map((item, idx) => {
          const preTokenBalObject = item?.meta?.preTokenBalances?.filter((item) => {
            return item.owner === blockchainAddress && item.mint === minterAddress;
          });
          const postTokenBalObject = item?.meta?.postTokenBalances?.filter((item) => {
            return item.owner === blockchainAddress && item.mint === minterAddress;
          });
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
            } else if ((!preTokenBalObject || preTokenBalObject.length <= 0) && postTokenBalObject) {
              difference = postTokenBalObject[0]?.uiTokenAmount?.uiAmount as number;
            } else if (preTokenBalObject && preTokenBalObject.length > 0) {
              difference = preTokenBalObject[0]?.uiTokenAmount?.uiAmount as number;
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
            difference: difference.toString() === "NaN" ? "1st transaction" : formatNumber(difference),
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
  }, [web3auth?.status, pageNumber, user?.blockchainAddress, isNext, refresh]);

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
    setRefresh((prev) => !prev);
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  const renderTransactionRows = () => {
    if (!transactionList || !Array.isArray(transactionList)) {
      return null;
    }

    const trimmedSearchQuery = searchQuery.toLowerCase().trim();

    // Filter transactions based on search query
    const filteredTransactions =
      trimmedSearchQuery ?
        transactionList.filter(
          (transaction) =>
            transaction.transactionHash.toLowerCase().includes(trimmedSearchQuery) ||
            transaction.difference.toString().toLowerCase().includes(trimmedSearchQuery) ||
            transaction.time.toString().toLowerCase().includes(trimmedSearchQuery) ||
            transaction.type.toString().toLowerCase().includes(trimmedSearchQuery)
        )
      : transactionList;

    return filteredTransactions.map((item) => (
      <tr key={item.transactionHash}>
        <td className="w-2/12 whitespace-nowrap px-5 py-6 text-[#222222]">{item.time}</td>
        <td className="w-2/12 text-clip whitespace-nowrap px-5 py-6 text-[#222222] underline">
          <Link href={`https://explorer.solana.com/tx/${item.transactionHash}`} target="_blank">
            {item.transactionHash.substring(0, 25)}
          </Link>
        </td>
        <td className="w-2/12 whitespace-nowrap px-5 py-6 text-[#222222]">{item.type}</td>
        <td className="w-2/12 whitespace-nowrap px-5 py-6 text-[#222222]">{item.difference}</td>
        <td className="w-2/12 whitespace-nowrap px-5 py-6 text-[#222222]">Settled</td>
      </tr>
    ));
  };

  return (
    <div className="flex min-w-[89%] flex-1 flex-col gap-5 sm:min-w-[600px]">
      <div className="items-center justify-start sm:flex-col sm:justify-between md:flex md:flex-row">
        <p className="flex w-[89%] px-2 pb-[14px] pt-[14px] text-xl font-medium text-[#222222] sm:p-0 md:px-0">
          Transaction History
        </p>
        <div className="flex items-center justify-end px-2 md:w-full md:px-0">
          <div className="relative rounded-lg border border-[#87878D] bg-white p-[1px]">
            <input
              type="text"
              name="searchTransactions"
              id="searchTransactions"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Transactions"
              className="h-[49px] w-full px-[22px] py-3 pr-[20px] outline-none md:py-[16px]"
            />
            <div className="absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2 cursor-pointer">
              <MagnifyingGlassIcon />
            </div>
          </div>
          <div className="ml-5">
            <div
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[8px] bg-[#0653EA] p-1 py-4 text-center font-medium"
              onClick={handleReset}
            >
              <div className={isSpinning ? "spin h-6 w-6" : "h-6 w-6"}>
                <RefreshIconTransaction color={"white"} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fund-table-scrollbar md:h- flex h-auto justify-center overflow-y-auto md:overflow-y-hidden`}
        style={{ direction: `${isMobile ? "rtl" : "ltr"}` }}
      >
        <div style={{ direction: "ltr" }} className="w-[89%] sm:w-[100%]">
          <div className="fund-table-scrollbar overflow-x-auto md:overflow-x-hidden">
            <table className="fund-table w-[100%]">
              <thead className="sticky top-0 bg-white text-sm font-bold uppercase tracking-[0.5px] text-[#7D90B8] opacity-100 sm:bg-[#F6FAFF]">
                <tr className="w-full">
                  <th className="px-5 py-5 text-start">Date</th>
                  <th className="px-5 py-5 text-start">Transaction Id</th>
                  <th className="px-5 py-5 text-start">Type</th>
                  <th className="px-5 py-5 text-start">Amount</th>
                  <th className="px-5 py-5 text-start">Status</th>
                </tr>
              </thead>
              <tbody>{renderTransactionRows()}</tbody>
            </table>
            <div className="mt-8 flex w-[94%] items-center justify-end">
              <div className="mx-auto flex gap-[11.71px]">
                <div className={`text-base font-normal text-[#87878D]`}>
                  {isLoading && "Loading transaction history..."}
                  {transactionList.length === 0 && !isLoading && "No transactions found."}
                </div>
              </div>
              {transactionList.length > 0 && (
                <>
                  <div
                    onClick={handlePrevPage}
                    className={`${pageNumber === 1 ? "cursor-not-allowed text-[#87878D]" : "cursor-pointer text-[#0653EA]"} mx-5 text-base font-normal`}
                  >
                    Previous
                  </div>
                  <div
                    className={`${transactionList.length < limit - 1 ? "cursor-not-allowed text-[#87878D]" : "cursor-pointer text-[#0653EA]"} mx-1 text-base font-normal`}
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
