
import {
  chevronDownIcon,
  chevronUpIcon,
  CopyIcon,
  Tooltip
} from "@/Components/Icons";
import { Fragment, useState, useEffect, useContext } from "react";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import useAuth from '@/hooks/useAuth';
import { SolanaWallet } from "@web3auth/solana-provider";

import {
  MagnifyingGlassIcon,
  WarningIcon,
  WalletIcon,
} from "@/Components/Icons";
import { useRouter } from "next/router";
import { useQRCode } from "next-qrcode";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import Head from "next/head";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";

import React from "react";

import { BalanceLoader } from "@/Components/Wrapped";
import { toast } from "react-toastify";
import { getPriorityFeeIx } from "@/hooks/utils";
import { shallowEqual, useSelector } from "react-redux";
import { Web3authContext } from '@/providers/web3authProvider';
import { useMobile } from "@/hooks/useMobile";
import LoginPage from "@/Components/common/LoginPage";



const AvailableBalance = ({ solbalance }) => {

  // const {userUSDWalletBalance} = useSelector((state) => {
  //   const {userUSDWalletBalance} = state.userReducer;
  //   return {userUSDWalletBalance}
  // }, shallowEqual);

  const userUSDWalletBalance = useSelector(
    (state) => state.value.userUSDWalletBalance
  );



  return (
    <div
      className="relative bg-white flex items-center px-[20px] sm:px-[32px] py-[37px] rounded-[30px] justify-between w-[89%] sm:w-[468px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex flex-col justify-between w-full h-full ">
        <div className="flex justify-between">
          <p className="text-xl font-medium text-[#222222]">Available Balance</p>
          <div className="sm:hidden  rounded-[50%] bg-[#CCE3FC] flex items-center justify-center p-[10px]">
            <div className="sm:hidden h-6 w-6">
              <WalletIcon isActive={true} />
            </div>
          </div>
        </div>
        {userUSDWalletBalance.isLoading  ? (
          <div className="my-4">
            <BalanceLoader />
          </div>
        ) : (
          <>
            <p className="text-3xl text-[#4285F4] font-medium">
            ${userUSDWalletBalance.amount}
            </p>
            <div className="flex">
              <p className=" text-sml text-[#838187] font-normal leading-[21px]">{`Solana Balance ${parseFloat(solbalance / LAMPORTS_PER_SOL)}`}</p>
            </div>
          </>
        )}
      </div>
      <div className="hidden  top-3 right-[9px] rounded-[50%] bg-[#CCE3FC] sm:absolute sm:flex items-center justify-center p-[10px]">
        <div className="h-6 w-6">
          <WalletIcon isActive={true} />
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = ({ transactions, user }) => {
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
    const pages = [];
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
            <thead className="sticky top-0 z-[500]  bg-white sm:bg-[#F6FAFF] opacity-100 text-[#7D90B8] uppercase text-sm font-bold tracking-[0.5px]">
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

const DepositAndWithdraw = ({
  walletId,
  activeSection,
  setActiveSection,
  setIsLoading,
  isLoading,
  setreFetchBal,
  refetchBal,
  setTokenBalance,
  tokenBalance,
  solbalance,
}) => {
  const router = useRouter();
  const [amount, setAmount] = useState(null);
  const [copy, setCopy] = useState(false);
  const [isCopyTooltipVisible,setIsCopyTooltipVisible] = useState(false);

  const notifySuccess = () =>
    toast.success("Success !. Your funds have been withdrawn successfully");

  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");

  const { user } = useAuth();

  const { provider } = useContext(Web3authContext)

  let userSolBalc = solbalance;
  const handleWithdraw = async () => {
    try {
      if (
        activeSection == 1 &&
        parseFloat(tokenBalance) <= parseFloat(amount)
      ) {
        console.log(tokenBalance, "this is tokenBalance");
        console.log(amount, "this is amount");
        console.log("amts=", parseFloat(tokenBalance), parseFloat(amount));

        toast.error("You do not have enough funds");

        return;
      }
      if (activeSection == 1 && parseFloat(userSolBalc) === 0) {
        console.log("amts=", parseFloat(tokenBalance), parseFloat(amount));
        toast.error("You do not have enough SOL");

        return;
      }
      //new PublicKey('fgdf')

      setIsLoading(true);

      const solanaWallet = new SolanaWallet(provider);

      console.log("solana wallet ", solanaWallet);
      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request({
        method: "solana_provider_config",
        params: [],
      });

      const connection = new Connection(connectionConfig.rpcTarget);
      const solbalance = await connection.getBalance(
        new PublicKey(accounts[0])
      );

      let mintAccount = process.env.NEXT_PUBLIC_MINT_ADDRESS;
      let tx = new Transaction();

      let recipientUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(recipientWalletAddress)
      );

      let senderUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(user?.blockchainAddress)
      );
      let ix = [];

      let priorityIx = await getPriorityFeeIx(connection);

      ix.push(priorityIx);

      let addRentFee = false;

      try {
        await getAccount(connection, recipientUSDCAddr);
      } catch (error) {
        if (error.name == "TokenAccountNotFoundError") {
          let createIx = createAssociatedTokenAccountInstruction(
            new PublicKey(user?.blockchainAddress),
            recipientUSDCAddr,
            new PublicKey(recipientWalletAddress),
            new PublicKey(mintAccount)
          );

          addRentFee = true;

          ix.push(createIx);
        }
      }

      console.log("amount = ", amount);
      let transferIx = createTransferInstruction(
        senderUSDCAddr,
        recipientUSDCAddr,
        new PublicKey(user?.blockchainAddress),
        parseFloat(amount) * Math.pow(10, 6)
      );

      ix.push(transferIx);

      tx.add(...ix);

      let blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;

      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(user?.blockchainAddress);

      console.log("transaction obj ", tx);
      try {
        let estimatedGas = await tx.getEstimatedFee(connection);

        if (addRentFee) {
          estimatedGas += process.env.NEXT_PUBLIC_ATA_RENT_FEE * LAMPORTS_PER_SOL;
        }

        if (solbalance < estimatedGas) {
          // normalized back to sol hence the division
          toast.error(`At least ${estimatedGas / LAMPORTS_PER_SOL} SOL required as gas fee`);
          setIsLoading(false);
          return;
        }

        const signature = await solanaWallet.signAndSendTransaction(tx);

        console.log("sig =", signature);

        setTokenBalance(tokenBalance - amount);
        console.log("new token bal=", amount);
        setTimeout(() => {
          setIsLoading(false);
          console.log("timeout over");
          router.prefetch("/homepage/funds");
        }, 10000);
        notifySuccess();
      } catch (err) {
        toast.error(err.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("pub key ", error);

      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const { SVG } = useQRCode();

  const handleAmountInputChanged = (e) => {
    let inputValue = e.target.value;
    // Replace any characters that are not numbers or decimal points with an empty string
    inputValue = inputValue.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point is present
    const decimalCount = inputValue.split(".").length - 1;
    if (decimalCount > 1) {
      // If more than one decimal point, remove the extra ones
      inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
    }

    setAmount(inputValue);
  };

  const [selectedMethod, setSelectedMethod] = useState({
    icon: "/images/bank-note-arrow.svg",
    name: "Native",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const options = [
    {
      icon: "/images/bank-note-arrow.svg",
      name: "Native",
    },
  ];

  const copyTextHandler = () => {
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  return (
    <div
      className="flex flex-col gap-[15px] items-center w-[89%] sm:w-[468px] bg-white rounded-[30px] py-[30px] sm:px-[29px] sm:shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)]"
    >
      <div className="flex gap-[5px] w-full">
        {["Deposit", "Withdraw"].map((text, index) => (
          <div key={index}
            onClick={() => {
              setActiveSection(index);
              setAmount("");
            }}
            className={`${activeSection === index ? "bg-[#222222] text-base text-white" : "bg-[#2222221A] text-[15px] text-[#222222]"} rounded-[30px] p-[10px] text-center cursor-pointer w-full`}
          >
            {text}
          </div>
        ))}
      </div>
      <div className="flex sm:hidden text-[#838187] text-[14px] w-full">
        <p>Choose your payment method</p>

      </div>
      <div className="flex flex-col gap-[5px] w-full">
        {activeSection === 0 && (
          <Accordion
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        )}
        {activeSection === 1 && (
          <div className="flex flex-col gap-[5px]">
            <label
              htmlFor="amount"
              className="text-[14px] font-normal text-[#838187]"
            >
              Choose your payment method
            </label>
            <Accordion
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
            {selectedMethod.name == "Native" && (
              <div>
                <div className="mt-2">
                  <label
                    htmlFor="walletId"
                    className="text-[14px] font-normal text-[#838187]"
                  >
                    Amount
                  </label>
                  <div className="flex items-center w-full rounded-lg py-[16px] px-[22px] text-[#87878D] text-[14px] font-normal border border-{#87878D}">
                    <label
                      htmlFor="usdc"
                      className=" text-[14px] font-normal text-[#838187]"
                    >
                      $
                    </label>

                    <input
                      type="text"
                      value={amount}
                      name="amount"
                      onChange={handleAmountInputChanged}
                      id="amount"
                      //   min={0}
                      className="appearance-none outline-none border-none flex-1 pl-[0.5rem] "
                    />
                  </div>
                </div>
                <div className="mt-2 ">
                  <label
                    htmlFor="walletId"
                    className="text-[14px] font-normal text-[#838187]"
                  >
                    Your Wallet ID
                  </label>
                  <input
                    type="text"
                    name="walletId"
                    id="walletId"
                    value={recipientWalletAddress}
                    onChange={(e) => setRecipientWalletAddress(e.target.value)}
                    className="w-full rounded-lg py-[16px] px-[22px] text-[#838187] text-[14px] font-normal outline-none border border-{#87878D}"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {activeSection === 0 && (
        <>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-start gap-[5px] flex-1">
              <label
                htmlFor="walletId"
                className="text-[14px] font-normal text-[#838187]"
              >
                Deposit Wallet ID
              </label>
              
            </div>
            <div className="w-[72px] h-[72px] bg-cover bg-no-repeat bg-center">
              {walletId && (
                <SVG
                  text={walletId}
                  options={{
                    margin: 2,
                    width: 72,
                    color: {
                      dark: "#000000",
                      light: "#FFFFFF",
                    },
                  }}
                />
              )}
            </div>
            
          </div>
          <div className="flex bg-[#DFF1FF] w-full justify-between rounded-lg">
              <input
                  className=" text-[#222222] text-[10px] sm:text-[13px] rounded-lg w-full py-[14px] pl-[20px] focus:outline-none"
                  type="text"
                  name="walletId"
                  id="walletId"
                  value={walletId}
                  disabled
                />
                <CopyToClipboard text={walletId} onCopy={copyTextHandler}>
                  <div className="flex items-center text-[#0653EA] text-[14px] cursor-pointer pl-[4px] pr-[18px]">
                    <div className="relative">
                      {isCopyTooltipVisible && <Tooltip isCopied={copy}/> }
                      <div onMouseEnter={()=>setIsCopyTooltipVisible(true)} onMouseLeave={()=>setIsCopyTooltipVisible(false)}>
                        <CopyIcon />
                      </div>
                    </div>
                  </div>
                </CopyToClipboard>
            </div>
                <hr className=" sm:hidden border border-black border-opacity-20 h-[1px]  w-full"/>
          {selectedMethod.name == "Stripe" && (
            <div className="w-full py-2 bg-[#0653EA] text-white flex items-center justify-center rounded-lg">
              COMING SOON{" "}
            </div>
          )}
        </>
      )}

      {activeSection === 1 && (
        <>
          {selectedMethod.name == "Stripe" ? (
            <div className="w-full py-2 bg-[#0653EA] text-white flex items-center justify-center rounded-lg">
              COMING SOON{" "}
            </div>
          ) : (
            <button
              disabled={isLoading}
              className="w-full py-2 bg-[#0653EA] cursor-pointer text-white flex items-center justify-center rounded-lg"
              onClick={handleWithdraw}
            >
              withdraw
            </button>
          )}
        </>
      )}
      <div className="flex items-center gap-[15px] p-[15px] bg-[#F2F2F2] ">
        <div className="w-6 h-6">
          <WarningIcon />
        </div>
        <div className="text-[#222222] sm:text-[14px] font-normal w-full ">
          {
            selectedMethod.name == "Stripe" ? (
              <p>
                Funds may be irrecoverable if you enter an incorrect wallet ID. It is crucial to ensure the accuracy of the provided ID to avoid any loss.
              </p>
            ):
            <div >
                To complete your deposit, please use your crypto wallet to deposit
                USDC to the following address:
              <br/>
              <div className="w-full">
                <p 
                  className="break-words w-[250px] sm:w-full text-[10px] sm:text-[13px]"
                  style={{ color: "#0653EA" }}
                >
                  {walletId}  
                </p>
              </div>
            </div>
          }
        </div>
      </div>
        {
          selectedMethod.name == "Native" &&
      <div className="flex items-center gap-[15px] p-[15px] bg-[#F2F2F2]">
        <div className="w-6 h-6">
          <WarningIcon />
        </div>
        <div className="text-[#222222] text-[14px] font-normal w-full">
          Scan the QR Code with your Wallet, you can use Phantom Wallet,
          Solflare, Exodus, Atomic Wallet, Coinbase Wallet, Metamask Span. Note
          that funds may be irrecoverable if you enter an incorrect wallet ID.
          It is crucial to ensure the accuracy of the provided ID to avoid any
          loss.
        </div>
      </div>
        }
    </div>
  );
};

const SelectAccordion = ({ options, selectedOption, setSelectedOption }) => {
  const handleSelection = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <select
      value={selectedOption}
      onChange={handleSelection}
      className="border rounded-lg p-4 cursor-pointer text-[14px] font-normal text-[#838187] outline-none"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const Accordion = ({ selectedMethod, setSelectedMethod }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelection = (method) => {
    setSelectedMethod(method);
    setIsOpen(false);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const supportedMethods = [
    {
      icon: "/images/Stripe.svg",
      name: "Stripe",
    },
    {
      icon: "/images/bank-note-arrow.svg",
      name: "Native",
    },
  ];
  return (
    <div className="border rounded-lg ">
      <div
        className="flex justify-between items-center p-2 cursor-pointer"
        onClick={toggleAccordion}
      >
        {selectedMethod.name != "" ? (
          <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2">
            <Image
              src={selectedMethod.icon}
              alt="Placeholder"
              className="w-8 h-8 mr-2"
              width={12}
              height={12}
            />
            <p>{selectedMethod.name}</p>
          </div>
        ) : (
          <div className="font-medium  text-[#838187] text-[12px]">Select</div>
        )}

        <div className="transform transition-transform duration-300">
          {isOpen ? chevronDownIcon() : chevronUpIcon()}
        </div>
      </div>
      {isOpen && (
        <div className=" p-4">
          <ul>
            {supportedMethods.map((method, index) => (
              <li
                key={index}
                onClick={() => handleSelection(method)}
                className="flex items-center cursor-pointer hover:bg-gray-100 p-2"
              >
                <Image
                  src={method.icon}
                  alt="Placeholder"
                  className="w-8 h-8 mr-2"
                  width={12}
                  height={12}
                />
                <p>{method.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
const Funds = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState();
  const [refetchBal, setreFetchBal] = useState(true);
  const { user, web3authStatus } = useAuth();
  const [tokenBalance, setTokenBalance] = useState("");
  const router = useRouter();
  const [solbalance, setSolBalance] = useState("0");
  const { provider } = useContext(Web3authContext)


  //get sol balance
  useEffect(() => {
    let fetchbalance = async () => {
      if (user && provider) {
        const solanaWallet = new SolanaWallet(provider);

        console.log("solana wallet ", solanaWallet);
        const accounts = await solanaWallet.requestAccounts();

        const connectionConfig = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
        });

        const connection = new Connection(connectionConfig.rpcTarget);
        const solbalance1 = await connection.getBalance(
          new PublicKey(accounts[0])
        );
        setSolBalance(solbalance1);
      }
    };
    fetchbalance()
      // make sure to catch any error
      .catch(console.error);
  }, [solbalance, user, web3authStatus]);

  // GET TRANSACTION HISTORY
  useEffect(() => {
    if (user) {
      fetch(
        `https://api.solana.fm/v0/accounts/${user?.blockchainAddress}/transfers?inflow=true&outflow=true&mint=${process.env.NEXT_PUBLIC_MINT_ADDRESS}&page=1`
      )
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error);
            });
          }

          return response.json();
        })
        .then((result) => {
          if (result.results) {
            setTransactionHistory(result.results);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user, web3authStatus]);

  useEffect(() => {
    if (transactionHistory) {
      const collectedTransactions = [];

      for (const trans of transactionHistory) {
        for (const key of trans.data) {
          const date = new Date(key.timestamp * 1000);
          const month = date.toLocaleString("default", { month: "short" });
          const day = date.getDate();
          const year = date.getFullYear();
          const hour = date.getHours().toString().padStart(2, "0");
          const minute = date.getMinutes().toString().padStart(2, "0");
          const second = date.getSeconds().toString().padStart(2, "0");

          //   key.date = `${month} ${day}, ${year} ${hour}:${minute}:${second}`;
          key.date = `${month} ${day}, ${year}`;

          if (key.token && key.amount >= 10000) {
            key.hash = trans.transactionHash.substring(0, 15) + "...";
            key.transHash = trans.transactionHash;
            collectedTransactions.push(key);
          }
        }
      }

      console.log(collectedTransactions);
      setTransactions(collectedTransactions);
    }
  }, [transactionHistory, user, web3authStatus]);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Wallet</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      <div className="relative rounded bg-white sm:bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden ">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={"Funds"} />
          <section className="relative  w-full h-full py-6 md:py-[37px]  flex flex-col gap-8 mb-[78.22px]  md:mb-0 overflow-y-scroll sm:pl-[68.82px] sm:pr-[55px]">
            <div className="flex  sm:gap-[50px] flex-wrap justify-center">
              <div className="flex flex-col gap-5 items-center sm:items-start ">
                <AvailableBalance
                  solbalance={solbalance}
                />
                <DepositAndWithdraw
                  walletId={user?.blockchainAddress}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                  setreFetchBal={setreFetchBal}
                  refetchBal={refetchBal}
                  setTokenBalance={setTokenBalance}
                  tokenBalance={tokenBalance}
                  solbalance={solbalance}
                />
              </div>
              <TransactionHistory transactions={transactions} user={user} />
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Funds;
