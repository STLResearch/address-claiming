"use client";
import {
  CloseIcon,
  SuccessIcon,
  chevronDownIcon,
  chevronUpIcon,
} from "@/Components/Icons";
import { Fragment, useState, useEffect } from "react";
import Script from "next/script";
import Sidebar from "@/Components/Sidebar";
import PageHeader from "@/Components/PageHeader";
import Spinner from "@/Components/Spinner";
import Backdrop from "@/Components/Backdrop";
import { useAuth } from "@/hooks/useAuth";
import { Web3Auth } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { Payload as SIWPayload, SIWWeb3 } from "@web3auth/sign-in-with-web3";
import base58 from "bs58";
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
  TokenAccountNotFoundError,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import Head from "next/head";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";

import React from "react";

import { createUSDCBalStore } from "@/zustand/store";
import { BalanceLoader } from "@/Components/Wrapped";
import { toast } from "react-toastify";

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const AvailableBalance = ({ balance, Solbalance, loading }) => {
  let { USDCBal, setUSDCBal } = createUSDCBalStore();
  useEffect(() => {
    setUSDCBal(balance);
  }, [balance]);

  return (
    <div
      className="relative bg-white flex items-center px-[32px] py-[37px] rounded-[30px] justify-between w-[468px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex flex-col justify-between h-full">
        <p className="text-xl font-medium text-[#222222]">Available Balance</p>
        {loading ? (
          <div className="my-4">
            <BalanceLoader />
          </div>
        ) : (
          <>
            <p className="text-3xl text-[#4285F4] font-medium">
              {USDollar.format(USDCBal)}
            </p>
            <p className=" text-lg text-gray-600 font-medium">{`Solana balance ${parseFloat(Solbalance / LAMPORTS_PER_SOL)}`}</p>
          </>
        )}
      </div>
      <div className="absolute top-3 right-[9px] rounded-[50%] bg-[#CCE3FC] flex items-center justify-center p-[10px]">
        <div className="h-6 w-6">
          <WalletIcon isActive={true} />
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = ({ transactions, user }) => {
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
    <div className="flex flex-col gap-5 flex-1 min-w-[600px]">
      <div className="flex justify-between items-center">
        <p className="font-medium text-xl text-[#222222]">
          Transaction History
        </p>
        <div
          className="relative px-[22px] py-[16px] bg-white w-[272px] rounded-lg"
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
      <table className="table-auto">
        <thead className="text-[#7D90B8] uppercase text-sm font-bold tracking-[0.5px]">
          <tr>
            {["date", "transaction id", "type", "amount", "status"].map(
              (th) => (
                <th className="text-start py-5 px-5">{th}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((transaction, index) => (
            <tr
              key={transaction.id}
              className={`${index % 2 === 0 && "bg-white"}`}
            >
              {/* {Object.values(transaction).map((value, secondIndex, array) => { return (<td className={`${secondIndex === 0 ? 'rounded-l-lg' : ''} py-6 ${secondIndex === array.length - 1 ? 'rounded-r-lg' : ''} text-[#222222] px-5`}>{value}</td>) })} */}
              <td className={`py-6 text-[#222222] px-5 w-2/12`}>
                {transaction.date}
              </td>
              <td className={`py- text-[#222222] text-clip px-5 w-2/12`}>
                <a
                  className=""
                  target="_blank"
                  href={`https://explorer.solana.com/tx/${transaction.transHash}`}
                >
                  {transaction.hash}
                </a>
              </td>
              <td className={`py-6 text-[#222222] px-5 w-2/12`}>
                {transaction.destination !== user.blockchainAddress
                  ? "withdraw"
                  : "deposit"}
              </td>
              <td className={`py-6 text-[#222222] px-5 w-2/12`}>
                ${transaction.amount / 1000000}
              </td>
              <td className={`py-6 text-[#222222] px-5 w-2/12`}>
                {transaction.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  );
};

const DepositAndWithdraw = ({
  walletId,
  activeSection,
  setActiveSection,
  setIsLoading,
  setreFetchBal,
  refetchBal,
  setTokenBalance,
  tokenBalance,
  Solbalance,
}) => {
  const router = useRouter();
  const [amount, setAmount] = useState(null);
  const [copy, setCopy] = useState(false);

  const notifySuccess = () =>
    toast.success("Success !. Your funds have been withdrawn successfully");
  

  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");

  const { user } = useAuth();
  let userSolBalc = Solbalance;
  const handleWithdraw = async () => {
    try {
      if (
        activeSection == 1 &&
        parseFloat(tokenBalance) <= parseFloat(amount)
      ) {
        console.log(tokenBalance, "this is tokenBalance");
        console.log(amount, "this is amount");
        console.log("amts=", parseFloat(tokenBalance), parseFloat(amount));

        toast.error(
          "You do not have enough funds"
        );

        return


      }
      if (activeSection == 1 && parseFloat(userSolBalc) == 0) {
        console.log("amts=", parseFloat(tokenBalance), parseFloat(amount));
        toast.error(
          "You do not have enough SOL"
        );

        return


      }
      //new PublicKey('fgdf')

      setIsLoading(true);

      const chainConfig = {
        chainNamespace: "solana",
        chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
        rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
        displayName: "Solana ",
        blockExplorer: "https://explorer.solana.com",
        ticker: "SOL",
        tickerName: "Solana",
      };

      const web3auth = new Web3Auth({
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
        chainConfig: chainConfig,
      });

      await web3auth.initModal();

      const web3authProvider = await web3auth.connect();

      const solanaWallet = new SolanaWallet(web3authProvider);

      console.log("solana wallet ", solanaWallet);
      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig = await solanaWallet.request({
        method: "solana_provider_config",
        params: [],
      });

      const connection = new Connection(connectionConfig.rpcTarget);
      const Solbalance = await connection.getBalance(
        new PublicKey(accounts[0])
      );

      console.log("sol balance = ", Solbalance);
      console.log("connection ", connection);
      let mintAccount = process.env.NEXT_PUBLIC_MINT_ADDRESS;
      let tx = new Transaction();
      console.log("sender ", user.blockchainAddress);
      console.log("reciever ", recipientWalletAddress);
      console.log(mintAccount);
      let recipientUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(recipientWalletAddress)
      );

      let senderUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(user.blockchainAddress)
      );
      let ix = [];
      try {
        await getAccount(connection, recipientUSDCAddr);
      } catch (error) {
        if (error.name == TokenAccountNotFoundError.name) {
          let createIx = createAssociatedTokenAccountInstruction(
            new PublicKey(user.blockchainAddress),
            recipientUSDCAddr,
            new PublicKey(recipientWalletAddress),
            new PublicKey(mintAccount)
          );

          ix.push(createIx);
        }
      }
      console.log("amount = ", amount);
      let transferIx = createTransferInstruction(
        senderUSDCAddr,
        recipientUSDCAddr,
        new PublicKey(user.blockchainAddress),
        parseFloat(amount) * Math.pow(10, 6)
      );

      ix.push(transferIx);

      tx.add(...ix);

      let blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;

      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(user.blockchainAddress);

      console.log("transaction obj ", tx);
      try {
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
      }
    } catch (error) {
      console.log("pub key ", error);

      setIsLoading(false);
      toast.error(err.message);
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

  const displayWalletId = walletId ? `${walletId.slice(0, 7)}...` : "";

  return (
    <div
      className="flex flex-col gap-[15px] items-center w-[468px] bg-white rounded-[30px] py-[30px] px-[29px]"
      style={{
        boxShadow: "0px 12px 34px -10px #3A4DE926",
      }}
    >
      <div></div>
      <div className="flex gap-[5px] w-full">
        {["Deposit", "Withdraw"].map((text, index) => (
          <div
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
          <div className="flex items-end gap-[11px]">
            <div className="flex flex-col items-start gap-[5px] flex-1">
              <label
                htmlFor="walletId"
                className="text-[14px] font-normal text-[#838187]"
              >
                Wallet ID
              </label>
              <div className="relative w-full">
                <input
                  className="bg-[#DFF1FF] text-[#222222] text-[14px] rounded-lg w-full py-[14px] pl-[22px] focus:outline-none pr-[95px]"
                  type="text"
                  name="walletId"
                  id="walletId"
                  value={walletId}
                  disabled
                />
                <CopyToClipboard text={walletId} onCopy={copyTextHandler}>
                  <p className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer">
                    {copy ? "Copied" : "Copy"}
                  </p>
                </CopyToClipboard>
              </div>
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
            <div
              className="w-full py-2 bg-[#0653EA] cursor-pointer text-white flex items-center justify-center rounded-lg"
              onClick={handleWithdraw}
            >
              withdraw
            </div>
          )}
        </>
      )}
      <div className="flex items-center gap-[15px] p-[15px] bg-[#F2F2F2]">
        <div className="w-6 h-6">
          <WarningIcon />
        </div>
        <div className="text-[#222222] text-[14px] font-normal w-full">
          To complete your deposit, please use your crypto wallet to deposit
          USDC to the following address:
          <span style={{ color: "#0653EA", marginLeft: "4px" }}>
            {displayWalletId}
          </span>{" "}
          Thank you
        </div>
      </div>
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
  const { user: selectorUser } = useAuth();
  const [user, setUser] = useState();
  const [token, setToken] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [signature, setSignature] = useState();
  const router = useRouter();
  const [Solbalance, setSolBalance] = useState("0");
  useEffect(() => {
    if (selectorUser) {
      const authUser = async () => {
        const chainConfig = {
          chainNamespace: "solana",
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };
        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });
        await web3auth.initModal();

        // await web3auth.connect();
        let userInfo;
        try {
          userInfo = await web3auth.getUserInfo();
        } catch (err) {
          localStorage.removeItem("openlogin_store");
          router.push("/auth/join");
          return;
        }

        const fetchedToken = JSON.parse(
          localStorage.getItem("openlogin_store")
        );

        if (!selectorUser) {
          localStorage.removeItem("openlogin_store");
          router.push("/auth/join");
          return;
        }

        setToken(fetchedToken.sessionId);
        setUser(selectorUser);
      };
      authUser();
    }
  }, [selectorUser]);

  // GET TOKEN BALANCE
  useEffect(() => {
    setBalanceLoading(true);
    if (user) {
      setInterval(() => {
        console.log("set interval function called");
        console.log({ user });
        const data = {
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenAccountsByOwner",
          params: [
            user.blockchainAddress,
            {
              mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
            },
            {
              encoding: "jsonParsed",
            },
          ],
        };

        fetch(process.env.NEXT_PUBLIC_SOLANA_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(errorData.error);
              });
            }

            return response.json();
          })
          .then((result) => {
            console.log(result, " this is result");
            if (result.result.value.length < 1) {
              setTokenBalance("0");
              setBalanceLoading(false);
              return;
            }
            console.log(
              "tokenBalance  ==  ",
              result.result.value[0].account.data.parsed.info.tokenAmount
                .uiAmountString
            );
            setTokenBalance(
              result.result.value[0].account.data.parsed.info.tokenAmount
                .uiAmountString
            );
            setBalanceLoading(false);
          })
          .catch((error) => {
            setTokenBalance("");
            setBalanceLoading(false);
            console.error(error);
          });
      }, 5000);
    }
  }, [user, selectorUser, refetchBal]);

  /*     useEffect(()=>{

        setInterval(()=>{
            console.log("set interval function called")
        },5000)
    },[]) */

  // GET SIGNATURE
  useEffect(() => {
    if (user) {
      const getSignature = async () => {
        const signatureObj = {};

        const chainConfig = {
          chainNamespace: "solana",
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };

        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });

        await web3auth.initModal();

        const web3authProvider = await web3auth.connect();

        const solanaWallet = new SolanaWallet(web3authProvider);

        console.log("solana wallet ", solanaWallet);
        const accounts = await solanaWallet.requestAccounts();

        const connectionConfig = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
        });

        const connection = new Connection(connectionConfig.rpcTarget);
        const Solbalance = await connection.getBalance(
          new PublicKey(accounts[0])
        );

        console.log("sol balance = ", Solbalance);
        // const userInfo = await web3auth.getUserInfo();

        const domain = window.location.host;
        const origin = window.location.origin;

        const payload = new SIWPayload();
        payload.domain = domain;
        payload.uri = origin;
        payload.address = user.blockchainAddress;
        payload.statement = "Sign in to SkyTrade app.";
        payload.version = "1";
        payload.chainId = 1;

        const header = { t: "sip99" };
        const network = "solana";

        let message = new SIWWeb3({ header, payload, network });

        const messageText = message.prepareMessage();
        const msg = new TextEncoder().encode(messageText);
        const result = await solanaWallet.signMessage(msg);

        const signature = base58.encode(result);

        signatureObj.sign = signature;
        signatureObj.sign_nonce = message.payload.nonce;
        signatureObj.sign_issue_at = message.payload.issuedAt;
        signatureObj.sign_address = user.blockchainAddress;
        setSignature(signatureObj);
      };

      getSignature();
    }
  }, [user]);

  //get sol balance
  useEffect(() => {
    let fetchbalance = async () => {
      if (user) {
        const chainConfig = {
          chainNamespace: "solana",
          chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: "Solana Mainnet",
          blockExplorer: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana",
        };

        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });

        await web3auth.initModal();

        const web3authProvider = await web3auth.connect();

        const solanaWallet = new SolanaWallet(web3authProvider);

        console.log("solana wallet ", solanaWallet);
        const accounts = await solanaWallet.requestAccounts();

        const connectionConfig = await solanaWallet.request({
          method: "solana_provider_config",
          params: [],
        });

        const connection = new Connection(connectionConfig.rpcTarget);
        const Solbalance1 = await connection.getBalance(
          new PublicKey(accounts[0])
        );
        setSolBalance(Solbalance1);
        console.log("sol balance = ", Solbalance);
      }
    };
    fetchbalance()
      // make sure to catch any error
      .catch(console.error);
  }, [Solbalance, user]);

  // GET TRANSACTION HISTORY
  useEffect(() => {
    if (user) {
      fetch(
        `https://api.solana.fm/v0/accounts/${user.blockchainAddress}/transfers?inflow=true&outflow=true&mint=${process.env.NEXT_PUBLIC_MINT_ADDRESS}&page=1`
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
  }, [user]);

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
  }, [transactionHistory]);

  return (
    <Fragment>
      <Head>
        <title>SkyTrade - Wallet</title>
      </Head>
      {isLoading && <Backdrop />}
      {isLoading && <Spinner />}
      <div className="relative rounded bg-[#F6FAFF] h-screen w-screen flex items-center justify-center overflow-hidden">
        <Sidebar />
        <div className="w-full h-full flex flex-col">
          <PageHeader pageTitle={"Funds"} />
          <section className="relative w-full h-full py-6 md:py-[37px] flex flex-col gap-8 mb-[78.22px] md:mb-0 overflow-y-scroll pl-[68.82px] pr-[55px]">
            <div className="flex gap-[50px] flex-wrap">
              <div className="flex flex-col gap-5">
                <AvailableBalance
                  loading={balanceLoading}
                  balance={tokenBalance}
                  Solbalance={Solbalance}
                />
                <DepositAndWithdraw
                  walletId={user?.blockchainAddress}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  setIsLoading={setIsLoading}
                  setreFetchBal={setreFetchBal}
                  refetchBal={refetchBal}
                  setTokenBalance={setTokenBalance}
                  tokenBalance={tokenBalance}
                  Solbalance={Solbalance}
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
