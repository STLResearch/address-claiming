import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { getPriorityFeeIx } from "@/hooks/utils";
import { Web3authContext } from "@/providers/web3authProvider";
import { getAssociatedTokenAddress, getAccount, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useQRCode } from "next-qrcode";
import { toast } from "react-toastify";
import { Tooltip, CopyIcon, WarningIcon, QuestionMarkIcon } from "../Icons";
import Accordion from "./Accordion";
import { DepositAndWithdrawProps, Web3authContextType, ConnectionConfig, PaymentMethod } from "../../types";
import CopyToClipboard from "react-copy-to-clipboard";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk"
import { TransactionInstruction } from "@solana/web3.js";
import { LiFiComponent, TRANSACTION_TYPE } from "./LifiComponent";
import { initializeTransak } from "@/utils/transak";

import axios from "axios";
import StripeOnrampComponent from "./Stripe/StripeComponent";
import StripeService from '@/services/StripeService'
import Backdrop from "../Backdrop";
import Spinner from "../Spinner";
import Link from "next/link";
const defaultPaymentMethod = {
  icon: "/images/bank-note-arrow.svg",
  name: "Native",
}

const DepositAndWithdraw = ({
  walletId,
  activeSection,
  setActiveSection,
  setTokenBalance,
  tokenBalance,
}: DepositAndWithdrawProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { createStripe } = StripeService();
  const { provider } = useContext(Web3authContext) as Web3authContextType
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const [amount, setAmount] = useState<string>('');
  const [copy, setCopy] = useState(false);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(defaultPaymentMethod);
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [showLIFI, setShowLIFI] = useState(false);
  const [LIFITransactionType, setLIFITransactionType] = useState<TRANSACTION_TYPE.DEPOSIT | TRANSACTION_TYPE.WITHDRAW>(TRANSACTION_TYPE.DEPOSIT);

  const [showOnramp, setShowOnramp] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripeLoading, setStripeLoading] = useState(false);


  const notifySuccess = () => {
    toast.success("Success !. Your funds have been withdrawn successfully");
  }

  const handleWithdraw = async () => {
    if (selectedMethod.name === "Ramp") {
      handleOnAndOffRamp()
    }
    else if (selectedMethod.name === "LI.FI") {
      setLIFITransactionType(TRANSACTION_TYPE.WITHDRAW);
      setShowLIFI(true);

    }
    else {
      await handleNativeAssetWithdrawal();
    }
  }

  const handleNativeAssetWithdrawal = async () => {
    if (!amount) return
    if (!user) return
    try {
      if (
        activeSection == 1 &&
        parseFloat(tokenBalance.toString()) <= parseFloat(amount || '0')
      ) {
        toast.error("You do not have enough funds");

        return;
      }
      setIsLoading(true);

      const solanaWallet = new SolanaWallet(provider);

      const accounts = await solanaWallet.requestAccounts();

      const connectionConfig: ConnectionConfig = await solanaWallet.request({
        method: "solana_provider_config",
        params: [],
      });

      const connection = new Connection(connectionConfig.rpcTarget);
      const solbalance = await connection.getBalance(
        new PublicKey(accounts[0])
      );

      if (activeSection == 1 && parseFloat(solbalance.toString()) === 0) {
        toast.error("You do not have enough SOL");

        return;
      }

      const mintAccount: string = process.env.NEXT_PUBLIC_MINT_ADDRESS as string;
      let tx = new Transaction();

      let recipientUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(recipientWalletAddress)
      );

      let senderUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(user?.blockchainAddress)
      );
      let ix: TransactionInstruction[] = [];

      let priorityIx: TransactionInstruction = await getPriorityFeeIx(connection);

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

      let transferIx = createTransferInstruction(
        senderUSDCAddr,
        recipientUSDCAddr,
        new PublicKey(user?.blockchainAddress),
        parseFloat(amount || '0') * Math.pow(10, 6)
      );

      ix.push(transferIx);

      tx.add(...ix);

      let blockhash = (await connection.getLatestBlockhash("finalized"))
        .blockhash;

      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(user?.blockchainAddress);

      try {
        let estimatedGas = await tx.getEstimatedFee(connection);

        if (!estimatedGas) return

        if (addRentFee) {
          estimatedGas += Number(process.env.NEXT_PUBLIC_ATA_RENT_FEE) * LAMPORTS_PER_SOL;
        }

        if (solbalance < estimatedGas) {
          toast.error(`At least ${estimatedGas / LAMPORTS_PER_SOL} SOL required as gas fee`);
          setIsLoading(false);
          return;
        }

        const signature = await solanaWallet.signAndSendTransaction(tx);

        setTokenBalance(tokenBalance - Number(amount));
        setTimeout(() => {
          setIsLoading(false);
          router.prefetch("/funds");
        }, 10000);
        notifySuccess();
      } catch (err) {
        toast.error(err.message);
        setIsLoading(false);
      }
    } catch (error) {

      setIsLoading(false);
      toast.error(error.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  const { SVG } = useQRCode();

  const handleAmountInputChanged = (e) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    const decimalCount = inputValue.split(".").length - 1;
    if (decimalCount > 1) {
      inputValue = inputValue.slice(0, inputValue.lastIndexOf("."));
    }

    setAmount(inputValue);
  };


  const handleOnAndOffRamp = () => {
    const isMobile = window.innerWidth <= 768;
    new RampInstantSDK({
      hostAppName: 'SKYTRADE APP',
      hostLogoUrl: 'https://app.sky.trade/images/logo-1.svg',
      hostApiKey: String(process.env.NEXT_PUBLIC_RAMP_API_KEY),
      defaultAsset: 'SOLANA_USDC',
      swapAsset: 'SOLANA_USDC',
      userAddress: user?.blockchainAddress,
      userEmailAddress: user?.email,
      enabledFlows: [activeSection === 0 ? 'ONRAMP' : 'OFFRAMP'],
      ...(process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME === "devnet" && {
        url: "https://app.demo.ramp.network",
      }),
      ...(isMobile && {
        variant: 'mobile',
        width: '100vw',
        height: '100vh',
      })
    }).show();

  };

  const copyTextHandler = () => {
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const togglePaymentMethod = (index: number) => {
    setSelectedMethod(defaultPaymentMethod)
    setActiveSection(index);
    setAmount("");
  }
  const handleDeposit = () => {
    const walletAddress = user?.blockchainAddress;
    const email = user?.email;

    initializeTransak({
      walletAddress,
      email,
      productsAvailed: 'BUY',
      onSuccess: (orderData) => {
        toast.success(`Deposited ${orderData?.status?.cryptoAmount} ${orderData?.status?.cryptoCurrency} to ${orderData?.status?.walletAddress} successfully! `);
      },
      onFailure: () => {
        toast.error('Deposit failed!');
      }
    });
  };

  const handleSelection = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method.name === "Ramp") handleOnAndOffRamp()
    else if (method.name === "Transak") handleDeposit()
    else if (method.name === "Stripe") handleStripe();
    else if (method.name === 'LI.FI') {
      setLIFITransactionType(TRANSACTION_TYPE.DEPOSIT);
      setShowLIFI(true);
    }
  };
  const walletAddress = user?.blockchainAddress;

  async function handleStripe() {
    try {
      setStripeLoading(true);
      const postData = {
        "blockchainAddress": walletId
      }
      const res = await createStripe(postData)
      if (res.data.client_secret) {
        setShowOnramp(true);
        setClientSecret(res.data.client_secret);
      }
    } catch (error) {
      toast.error('something went wrong please try again later!')
    }
    finally {
      setStripeLoading(false);
    }

  }

  return (
    <div
      className="flex flex-col gap-[15px] items-center w-[89%] sm:w-[468px] bg-white rounded-[30px] py-[30px] sm:px-[29px] sm:shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)]"
    >
      <div className="flex gap-[5px] w-full">
        {["Deposit", "Withdraw"].map((text, index) => (
          <div key={index}
            onClick={() => togglePaymentMethod(index)}
            className={`${activeSection === index ? "bg-[#222222] text-base text-white" : "bg-[#2222221A] text-[15px] text-[#222222]"} rounded-[30px] p-[10px] text-center cursor-pointer w-full`}
          >
            {text}
          </div>
        ))}
      </div>
      <div className="flex text-[#838187] text-[14px] w-full">
        <p>Choose your payment method</p>

      </div>
      <div className="flex flex-col gap-[5px] w-full">
        {activeSection === 0 && (
          <Accordion
            selectedMethod={selectedMethod}
            setSelectedMethod={handleSelection}
            activeSection={activeSection}
          />
        )}
        {activeSection === 1 && (
          <div className="flex flex-col gap-[5px]">
            <Accordion
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              activeSection={activeSection}
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
                  {isCopyTooltipVisible && <Tooltip isCopied={copy} />}
                  <div onMouseEnter={() => setIsCopyTooltipVisible(true)} onMouseLeave={() => setIsCopyTooltipVisible(false)}>
                    <CopyIcon />
                  </div>
                </div>
              </div>
            </CopyToClipboard>
          </div>
          <hr className=" sm:hidden border border-black border-opacity-20 h-[1px]  w-full" />

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
      {activeSection === 0 && (
        <>
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
                ) :
                  <div >
                    To complete your deposit, please use your crypto wallet to deposit
                    USDC to the following address:
                    <br />
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
        </>
      )}
    {
      <Link target="_blank" href="https://help.sky.trade/article/how-to-buy-usdc-on-the-solana-network-a-simple-guide">
       <div className="flex items-center gap-[5px]">
          <div className="w-6 h-6">
            <QuestionMarkIcon />
          </div>
           <p className="text-[#0000FF] text-base ">Simple Guide to Buy USDC on the Solana Network</p>
      </div>
       </Link>
    }
 
      {
        showLIFI &&
        <div>
          <Backdrop />
          <LiFiComponent
            transactionType={LIFITransactionType}
            walletAddress={walletAddress}
            onClose={() => (setShowLIFI(false))}
          />

        </div>
      }
      {stripeLoading ?
        <div>
          {" "}
          <Backdrop />
          <Spinner />
        </div> :
        showOnramp &&
        (
          <div>
            <Backdrop />
            <StripeOnrampComponent clientSecret={clientSecret} setClientSecret={setClientSecret} setShowOnramp={setShowOnramp} showOnramp={showOnramp} />
          </div>
        )
      }
    </div>
  );
};
export default DepositAndWithdraw;