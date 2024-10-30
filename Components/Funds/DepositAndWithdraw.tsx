import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import tokenMessengerAbi from "../../helpers/eth/abis/cctp/TokenMessenger.json";
import usdcAbi from "../../helpers/eth/abis/Usdc.json";
import { getPriorityFeeIx } from "@/hooks/utils";
import { Web3authContext } from "@/providers/web3Provider";
import {
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  createAssociatedTokenAccount,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useQRCode } from "next-qrcode";
import { toast } from "react-toastify";
import { Tooltip, CopyIcon, WarningIcon, QuestionMarkIcon } from "../Icons";
import Accordion from "./Accordion";
import { DepositAndWithdrawProps, Web3authContextType, ConnectionConfig, PaymentMethod } from "../../types";
import CopyToClipboard from "react-copy-to-clipboard";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import { LiFiComponent, TRANSACTION_TYPE } from "./LifiComponent";
import { initializeTransak } from "@/utils/transak";

import StripeOnrampComponent from "./Stripe/StripeComponent";
import StripeService from "@/services/StripeService";
import Backdrop from "../Backdrop";
import Spinner from "../Spinner";
import Link from "next/link";
import LoadingButton from "../LoadingButton/LoadingButton";
import { approveTxVals, burnTxVals, checkAttestation, msgBytes } from "@/helpers/eth";
import { recieveSol } from "@/helpers/solana_anchor/recieveMessage";
import SuccessModal from "../Airspace/SuccessModalSwap";
import { ConnectKitButton } from "connectkit";
import {
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseWriteContractParameters,
} from "wagmi";
import { SerializedTransactionReturnType, WriteContractReturnType } from "viem";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import Web3 from "web3";
import { sendTransaction } from "@wagmi/core";
import { config } from "../Web3AuthProvider";
import { USDC_ADDRESS } from "@/helpers/solana_anchor/sol_const";

const defaultPaymentMethod = {
  icon: "",
  name: "",
};

const DepositAndWithdraw = ({
  walletId,
  activeSection,
  setActiveSection,
  setTokenBalance,
  tokenBalance,
}: DepositAndWithdrawProps) => {
  const [showSuccessPopUp, setShowSuccessPopUp] = useState<boolean>(false);
  const [showFailurePopUp, setShowFailurePopUp] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showLIFI, setShowLIFI] = useState(false);
  const [LIFITransactionType, setLIFITransactionType] = useState<TRANSACTION_TYPE.DEPOSIT | TRANSACTION_TYPE.WITHDRAW>(
    TRANSACTION_TYPE.DEPOSIT
  );
  const [txSig, setTxSig] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const { createStripe } = StripeService();
  const { provider } = useContext(Web3authContext) as Web3authContextType;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>("");
  const [copy, setCopy] = useState(false);
  const [isCopyTooltipVisible, setIsCopyTooltipVisible] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState(defaultPaymentMethod);
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showOnramp, setShowOnramp] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripeLoading, setStripeLoading] = useState(false);

  const [usdcFormAmount, setUsdcFormAmount] = useState(0);
  //onst { data:burnTxHash,error:BurnTxError,isSuccess:isBurnTxSuccess,writeContractAsync:burnTx } = useWriteContract()
  const { address } = useAccount();

  const notifySuccess = () => {
    toast.success("Success !. Your funds have been withdrawn successfully");
  };

  const handleWithdraw = async () => {
    if (selectedMethod.name === "Ramp") {
      handleOnAndOffRamp();
    } else if (selectedMethod.name === "LI.FI") {
      setLIFITransactionType(TRANSACTION_TYPE.WITHDRAW);
      setShowLIFI(true);
    } else {
      await handleNativeAssetWithdrawal();
    }
  };

  const handleNativeAssetWithdrawal = async () => {
    if (!amount) return;
    if (!user) return;
    try {
      if (activeSection === 1 && parseFloat(tokenBalance.toString()) <= parseFloat(amount || "0")) {
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
      const solbalance = await connection.getBalance(new PublicKey(accounts[0]));

      if (activeSection === 1 && parseFloat(solbalance.toString()) === 0) {
        toast.error("You do not have enough SOL");

        return;
      }

      const mintAccount: string = process.env.NEXT_PUBLIC_MINT_ADDRESS as string;
      const tx = new Transaction();

      const recipientUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(recipientWalletAddress)
      );

      const senderUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(user?.blockchainAddress)
      );
      const ix: TransactionInstruction[] = [];

      const priorityIx: TransactionInstruction = await getPriorityFeeIx(connection);

      ix.push(priorityIx);

      let addRentFee = false;

      try {
        await getAccount(connection, recipientUSDCAddr);
      } catch (error) {
        if (error.name === "TokenAccountNotFoundError") {
          const createIx = createAssociatedTokenAccountInstruction(
            new PublicKey(user?.blockchainAddress),
            recipientUSDCAddr,
            new PublicKey(recipientWalletAddress),
            new PublicKey(mintAccount)
          );

          addRentFee = true;

          ix.push(createIx);
        }
      }

      const transferIx = createTransferInstruction(
        senderUSDCAddr,
        recipientUSDCAddr,
        new PublicKey(user?.blockchainAddress),
        parseFloat(amount || "0") * Math.pow(10, 6)
      );

      ix.push(transferIx);

      tx.add(...ix);

      const { blockhash } = await connection.getLatestBlockhash("finalized");

      tx.recentBlockhash = blockhash;
      tx.feePayer = new PublicKey(user?.blockchainAddress);

      try {
        let estimatedGas = await tx.getEstimatedFee(connection);

        if (!estimatedGas) return;

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
    } finally {
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
      hostAppName: "SKYTRADE APP",
      hostLogoUrl: "https://app.sky.trade/images/logo-1.svg",
      hostApiKey: String(process.env.NEXT_PUBLIC_RAMP_API_KEY),
      defaultAsset: "SOLANA_USDC",
      swapAsset: "SOLANA_USDC",
      userAddress: user?.blockchainAddress,
      userEmailAddress: user?.email,
      enabledFlows: [activeSection === 0 ? "ONRAMP" : "OFFRAMP"],
      ...(process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME === "devnet" && {
        url: "https://app.demo.ramp.network",
      }),
      ...(isMobile && {
        variant: "mobile",
        width: "100vw",
        height: "100vh",
      }),
    }).show();
  };

  const copyTextHandler = () => {
    setCopy(true);

    setTimeout(() => {
      setCopy(false);
    }, 2000);
  };

  const togglePaymentMethod = (index: number) => {
    setSelectedMethod(defaultPaymentMethod);
    setActiveSection(index);
    setAmount("");
  };
  const handleDeposit = () => {
    const walletAddress = user?.blockchainAddress;
    const email = user?.email;

    initializeTransak({
      walletAddress,
      email,
      productsAvailed: "BUY",
      onSuccess: (orderData) => {
        toast.success(
          `Deposited ${orderData?.status?.cryptoAmount} ${orderData?.status?.cryptoCurrency} to ${orderData?.status?.walletAddress} successfully! `
        );
      },
      onFailure: () => {
        toast.error("Deposit failed!");
      },
    });
  };

  const handleSelection = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method.name === "Ramp") handleOnAndOffRamp();
    else if (method.name === "Transak") handleDeposit();
    else if (method.name === "Stripe") handleStripe();
    else if (method.name === "LI.FI") {
      setLIFITransactionType(TRANSACTION_TYPE.DEPOSIT);
      setShowLIFI(true);
    }
  };
  const walletAddress = user?.blockchainAddress;

  async function handleStripe() {
    try {
      setStripeLoading(true);
      const postData = {
        blockchainAddress: walletId,
      };
      const res = await createStripe(postData);
      if (res.data.client_secret) {
        setShowOnramp(true);
        setClientSecret(res.data.client_secret);
      }
    } catch (error) {
      toast.error("something went wrong please try again later!");
    } finally {
      setStripeLoading(false);
    }
  }

  const handleDepositWithdraw = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    
    // let recvieveATA=await createAssociatedTokenAccount()
    let userata = await getAssociatedTokenAddress(
      new PublicKey(USDC_ADDRESS as string),
      new PublicKey(user?.blockchainAddress as string)
    );
   
    setIsLoading(true);
    let ans1 = await approveTxVals(address as string, userata.toString(), usdcFormAmount);
    const approveResult = await sendTransaction(config, {
      data: ans1.data as `0x${string}`,
      to: ans1.to as `0x${string}`,
    });
    
    let approveTxreciept = await waitForTransaction(approveResult);
  
    let ans2 = await burnTxVals(address as string, userata.toString(), usdcFormAmount);
    const burnResult = await sendTransaction(config, {
      data: ans2.data as `0x${string}`,
      to: ans2.to as `0x${string}`,
    });
    
    let burnTxreciept = await waitForTransaction(burnResult);
   
    let ans3 = await msgBytes(burnResult);
    
    let { messageBytes, attestationSignature } = await checkAttestation(
      ans3.messageBytes as string,
      ans3.messageHash as string
    );

    let _txsig = await recieveSol(
      messageBytes as string,
      attestationSignature as string,
      provider,
      user?.blockchainAddress as string,
      userata
    );
    if (_txsig) {
      setTxSig(_txsig);
      setIsLoading(false);

      setShowSuccessPopUp(true);
    }
   
  };
  const waitForTransaction = async (txHash: any) => {
    let web3 = new Web3(process.env.NEXT_PUBLIC_ETH_TESTNET_RPC);
    let transactionReceipt = await web3.eth.getTransactionReceipt(txHash).catch((err) => {
      console.log("tx pending");
    });
   
    while (transactionReceipt == undefined || transactionReceipt.status.toString() === "FALSE") {
     
      transactionReceipt = await web3.eth.getTransactionReceipt(txHash).catch((err) => {
        console.log("tx pending");
      });
      await new Promise((r) => setTimeout(r, 4000));
    }
    return transactionReceipt;
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <div className="sm:shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)] flex w-full flex-col items-center gap-[15px] rounded-[30px] bg-white p-8">
      <div className="flex w-full justify-between gap-4">
        {["Deposit", "Withdraw"].map((text, index) => (
          <div
            key={index}
            onClick={() => togglePaymentMethod(index)}
            className={`${activeSection === index ? "bg-[#222222] text-base text-white" : "bg-[#2222221A] text-[15px] text-[#222222]"} w-full cursor-pointer rounded-[30px] p-[10px] text-center`}
          >
            {text}
          </div>
        ))}
      </div>
      <div className="flex w-full text-[14px] text-[#838187]">
        <p>Choose your payment method</p>
      </div>
      {(showSuccessPopUp || showFailurePopUp) && (
        <SuccessModal
          errorMessages={errorMessages}
          tx={txSig}
          isSuccess={showSuccessPopUp}
          closePopUp={() => {
            showFailurePopUp ? setShowFailurePopUp(false) : setShowSuccessPopUp(false);
          }}
        />
      )}
      <div className="flex w-full flex-col gap-6">
        <Accordion selectedMethod={selectedMethod} setSelectedMethod={handleSelection} activeSection={activeSection} />
        {activeSection === 0 && !selectedMethod.name && (
          <div>
            <LoadingButton
              isLoading={false}
              className="flex h-[39px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#0653EA] py-[16px] text-[15px] text-white"
              onClick={""}
            >
              Deposit
            </LoadingButton>
            <div className="mt-4 flex items-center gap-[15px] bg-[#F2F2F2] p-[15px]">
              <div className="h-6 w-6">
                <WarningIcon />
              </div>
              <p className="w-full font-normal text-[#222222] sm:text-[14px]">
                Funds may be irrecoverable if you enter an incorrect wallet ID. It is crucial to ensure the accuracy of
                the provided ID to avoid any loss.
              </p>
            </div>
            <Link
              target="_blank"
              href="https://help.sky.trade/article/how-to-buy-usdc-on-the-solana-network-a-simple-guide"
            >
              <div className="mt-4 flex items-center gap-[5px]">
                <div className="h-6 w-6">
                  <QuestionMarkIcon />
                </div>
                <p className="text-[14px] text-[#0000FF]">Simple Guide to Buy USDC on the Solana Network</p>
              </div>
            </Link>
          </div>
        )}
        {activeSection === 0 && selectedMethod.name == "Swap" && (
          <div>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-1 flex-col items-start gap-[5px]">
                <ConnectKitButton />
                {address && (
                  <form className="mx-auto max-w-sm">
                    <div className="mb-5">
                      <label htmlFor="USDC" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        USDC ETH
                      </label>
                      <input
                        type="number"
                        id="USDC"
                        onChange={(e) => {
                          setUsdcFormAmount(parseFloat(e.target.value));
                        }}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleDepositWithdraw}
                      className="rounded-xl bg-gray-200 px-8 py-1 text-center tracking-wider text-black hover:bg-black hover:text-white"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </div>
              <div className="h-[72px] w-[72px] bg-cover bg-center bg-no-repeat"></div>
            </div>
            <div className="flex w-full justify-between rounded-lg bg-[#DFF1FF]"></div>
            <hr className="h-[1px] w-full border border-black border-opacity-20 sm:hidden" />
          </div>
        )}

        {(selectedMethod.name === "Stripe" ||
          selectedMethod.name === "Ramp" ||
          selectedMethod.name === "LI.FI" ||
          selectedMethod.name === "Transak") &&
          activeSection === 0 && (
            <div>
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-1 flex-col items-start gap-[5px]">
                  <label htmlFor="walletId" className="text-[14px] font-normal text-[#838187]">
                    Deposit Wallet ID
                  </label>
                </div>
                <div className="h-[72px] w-[72px] bg-cover bg-center bg-no-repeat">
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
              <div className="mt-4 flex w-full justify-between rounded-lg bg-[#DFF1FF]">
                <input
                  className="w-full rounded-lg py-[14px] pl-[20px] text-[10px] text-[#222222] focus:outline-none sm:text-[13px]"
                  type="text"
                  name="walletId"
                  id="walletId"
                  value={walletId}
                  disabled
                />
                <CopyToClipboard text={walletId} onCopy={copyTextHandler}>
                  <div className="flex cursor-pointer items-center pl-[4px] pr-[18px] text-[14px] text-[#0653EA]">
                    <div className="relative">
                      {isCopyTooltipVisible && <Tooltip isCopied={copy} />}
                      <div
                        onMouseEnter={() => setIsCopyTooltipVisible(true)}
                        onMouseLeave={() => setIsCopyTooltipVisible(false)}
                      >
                        <CopyIcon />
                      </div>
                    </div>
                  </div>
                </CopyToClipboard>
              </div>
              <hr className="h-[1px] w-full border border-black border-opacity-20 sm:hidden" />
              <div className="mt-4 flex items-center gap-[15px] bg-[#F2F2F2] p-[15px]">
                <div className="h-6 w-6">
                  <WarningIcon />
                </div>
                <div className="w-[341px] font-normal text-[#222222] sm:text-[14px]">
                  <div>
                    Funds may be irrecoverable if you enter an incorrect wallet ID. It is crucial to ensure the accuracy
                    of the provided ID to avoid any loss.
                    <br />
                    <div className="w-full">
                      <p
                        className="w-[250px] break-words text-[10px] sm:w-full sm:text-[13px]"
                        style={{ color: "#0653EA" }}
                      >
                        {walletId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                target="_blank"
                href="https://help.sky.trade/article/how-to-buy-usdc-on-the-solana-network-a-simple-guide"
              >
                <div className="mt-4 flex items-center gap-[5px]">
                  <div className="h-6 w-6">
                    <QuestionMarkIcon />
                  </div>
                  <p className="text-[14px] text-[#0000FF]">Simple Guide to Buy USDC on the Solana Network</p>
                </div>
              </Link>
            </div>
          )}
      </div>
      {selectedMethod.name === "Native" && activeSection === 0 && (
        <div>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-1 flex-col items-start gap-[5px]">
              <label htmlFor="walletId" className="text-[14px] font-normal text-[#838187]">
                Deposit Wallet ID
              </label>
            </div>
            <div className="h-[72px] w-[72px] bg-cover bg-center bg-no-repeat">
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
          <div className="mt-4 flex w-full justify-between rounded-lg bg-[#DFF1FF]">
            <input
              className="w-full rounded-lg py-[14px] pl-[20px] text-[10px] text-[#222222] focus:outline-none sm:text-[13px]"
              type="text"
              name="walletId"
              id="walletId"
              value={walletId}
              disabled
            />
            <CopyToClipboard text={walletId} onCopy={copyTextHandler}>
              <div className="flex cursor-pointer items-center pl-[4px] pr-[18px] text-[14px] text-[#0653EA]">
                <div className="relative">
                  {isCopyTooltipVisible && <Tooltip isCopied={copy} />}
                  <div
                    onMouseEnter={() => setIsCopyTooltipVisible(true)}
                    onMouseLeave={() => setIsCopyTooltipVisible(false)}
                  >
                    <CopyIcon />
                  </div>
                </div>
              </div>
            </CopyToClipboard>
          </div>
          <hr className="h-[1px] w-full border border-black border-opacity-20 sm:hidden" />
          <div className="mt-4 flex items-center gap-[15px] bg-[#F2F2F2] p-[15px]">
            <div className="h-6 w-6">
              <WarningIcon />
            </div>
            <div className="w-[341px] font-normal text-[#222222] sm:text-[14px]">
              <div>
                To complete your deposit, please use your crypto wallet to deposit USDC to the following address:
                <br />
                <div className="w-full">
                  <p
                    className="w-[250px] break-words text-[10px] sm:w-full sm:text-[13px]"
                    style={{ color: "#0653EA" }}
                  >
                    {walletId}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-[15px] bg-[#F2F2F2] p-[15px]">
            <div className="h-6 w-6">
              <WarningIcon />
            </div>
            <div className="w-full text-[14px] font-normal text-[#222222]">
              Scan the QR Code with your Wallet. You can use Phantom Wallet, Solflare, Exodus, Atomic Wallet, Coinbase
              Wallet, or Metamask Span. Ensure the wallet ID is correct to avoid loss of funds.
            </div>
          </div>
        </div>
      )}

      {/* Widthdraw */}
      {activeSection === 1 && (
        <div>
          {selectedMethod.name === "Native" && (
            <div>
              <div className="mt-2">
                <label htmlFor="walletId" className="text-[14px] font-normal text-[#838187]">
                  Amount
                </label>
                <div className="border-{#87878D} flex w-full items-center rounded-lg border px-[22px] py-[16px] text-[14px] font-normal text-[#87878D]">
                  <label htmlFor="usdc" className="text-[14px] font-normal text-[#838187]">
                    $
                  </label>

                  <input
                    type="text"
                    value={amount}
                    name="amount"
                    onChange={handleAmountInputChanged}
                    id="amount"
                    //   Min={0}
                    className="flex-1 appearance-none border-none pl-[0.5rem] outline-none"
                  />
                </div>
              </div>
              <div className="mt-2">
                <label htmlFor="walletId" className="text-[14px] font-normal text-[#838187]">
                  Your Wallet ID
                </label>
                <input
                  type="text"
                  name="walletId"
                  id="walletId"
                  value={recipientWalletAddress}
                  onChange={(e) => setRecipientWalletAddress(e.target.value)}
                  className="border-{#87878D} w-full rounded-lg border px-[22px] py-[16px] text-[14px] font-normal text-[#838187] outline-none"
                />
              </div>
            </div>
          )}
          <div>
            <>
              {(
                selectedMethod.name === "Stripe" ||
                selectedMethod.name === "Ramp" ||
                selectedMethod.name === "Native" ||
                selectedMethod.name === "LI.FI"
              ) ?
                <LoadingButton
                  isLoading={false}
                  className="mt-4 flex h-[39px] w-full cursor-pointer items-center justify-center rounded-lg bg-[#0653EA] py-[16px] text-[15px] text-white"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </LoadingButton>
              : null}
            </>
          </div>

          <div className="mt-4 flex items-center gap-[15px] bg-[#F2F2F2] p-[15px]">
            <div className="h-6 w-6">
              <WarningIcon />
            </div>
            <p className="w-full font-normal text-[#222222] sm:text-[14px]">
              Funds may be irrecoverable if you enter an incorrect wallet ID. It is crucial to ensure the accuracy of
              the provided ID to avoid any loss.
            </p>
          </div>
        </div>
      )}

      {showLIFI && (
        <div>
          <Backdrop />
          <LiFiComponent
            transactionType={LIFITransactionType}
            walletAddress={walletAddress}
            onClose={() => setShowLIFI(false)}
          />
        </div>
      )}
      {stripeLoading ?
        <div>
          {" "}
          <Backdrop />
          <Spinner />
        </div>
      : showOnramp && (
          <div>
            <Backdrop />
            <StripeOnrampComponent
              clientSecret={clientSecret}
              setClientSecret={setClientSecret}
              setShowOnramp={setShowOnramp}
              showOnramp={showOnramp}
            />
          </div>
        )
      }
    </div>
  );
};
export default DepositAndWithdraw;
