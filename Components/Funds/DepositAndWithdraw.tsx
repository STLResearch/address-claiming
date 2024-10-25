import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import tokenMessengerAbi from '../../helpers/eth/abis/cctp/TokenMessenger.json'
import usdcAbi from '../../helpers/eth/abis/Usdc.json'
import { getPriorityFeeIx } from "@/hooks/utils";
import { Web3authContext } from "@/providers/web3authProvider";
import {
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction, createAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
} from "@solana/web3.js";
import { SolanaWallet } from "@web3auth/solana-provider";
import { useQRCode } from "next-qrcode";
import { toast } from "react-toastify";
import { Tooltip, CopyIcon, WarningIcon, QuestionMarkIcon } from "../Icons";
import Accordion from "./Accordion";
import {
  DepositAndWithdrawProps,
  Web3authContextType,
  ConnectionConfig,
  PaymentMethod,
} from "../../types";
import CopyToClipboard from "react-copy-to-clipboard";
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import { LiFiComponent, TRANSACTION_TYPE } from "./LifiComponent";
import { initializeTransak } from "@/utils/transak";

import StripeOnrampComponent from "./Stripe/StripeComponent";
import StripeService from "@/services/StripeService";
import Backdrop from "../Backdrop";
import Spinner from "../Spinner";
import Link from "next/link";
import LoadingButton from "../LoadingButton/LoadingButton";import { approveTxVals, burnTxVals, checkAttestation,  msgBytes } from "@/helpers/eth";
import { recieveSol } from "@/helpers/solana_anchor/recieveMessage";
import SuccessModal from "../Airspace/SuccessModalSwap";
import { ConnectKitButton } from "connectkit";
import { useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract, UseWriteContractParameters } from "wagmi";
import { SerializedTransactionReturnType, WriteContractReturnType } from "viem";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import Web3 from "web3";
import { ETH_TESTNET_RPC } from "@/helpers/eth/eth_const";
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

  const [txSig,setTxSig]= useState("")
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
  const [isClient, setIsClient] = useState(false)
 
 //onst { data:burnTxHash,error:BurnTxError,isSuccess:isBurnTxSuccess,writeContractAsync:burnTx } = useWriteContract()
  const {address}=useAccount()

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
      if (
        activeSection === 1 &&
        parseFloat(tokenBalance.toString()) <= parseFloat(amount || "0")
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
        new PublicKey(accounts[0]),
      );

      if (activeSection === 1 && parseFloat(solbalance.toString()) === 0) {
        toast.error("You do not have enough SOL");

        return;
      }

      const mintAccount: string = process.env
        .NEXT_PUBLIC_MINT_ADDRESS as string;
      const tx = new Transaction();

      const recipientUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(recipientWalletAddress),
      );

      const senderUSDCAddr = await getAssociatedTokenAddress(
        new PublicKey(mintAccount),
        new PublicKey(user?.blockchainAddress),
      );
      const ix: TransactionInstruction[] = [];

      const priorityIx: TransactionInstruction =
        await getPriorityFeeIx(connection);

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
            new PublicKey(mintAccount),
          );

          addRentFee = true;

          ix.push(createIx);
        }
      }

      const transferIx = createTransferInstruction(
        senderUSDCAddr,
        recipientUSDCAddr,
        new PublicKey(user?.blockchainAddress),
        parseFloat(amount || "0") * Math.pow(10, 6),
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
          estimatedGas +=
            Number(process.env.NEXT_PUBLIC_ATA_RENT_FEE) * LAMPORTS_PER_SOL;
        }

        if (solbalance < estimatedGas) {
          toast.error(
            `At least ${estimatedGas / LAMPORTS_PER_SOL} SOL required as gas fee`,
          );
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
          `Deposited ${orderData?.status?.cryptoAmount} ${orderData?.status?.cryptoCurrency} to ${orderData?.status?.walletAddress} successfully! `,
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

 


  const handleDepositWithdraw = async () => {
		console.log("start");
   // let recvieveATA=await createAssociatedTokenAccount()
    let userata=await getAssociatedTokenAddress(new PublicKey(USDC_ADDRESS),new PublicKey(user?.blockchainAddress as string))
    console.log('userata',userata.toString())
    setIsLoading(true);
		let ans1 = await approveTxVals(address as string,userata.toString());
		const approveResult = await sendTransaction(config, {
			data: ans1.data as `0x${string}`,
			to: ans1.to as `0x${string}`,
		});
		console.log(approveResult);
		let approveTxreciept = await waitForTransaction(approveResult);
		console.log({ approveTxreciept });
		console.log("middle1");
		let ans2 = await burnTxVals(address as string,userata.toString());
		const burnResult = await sendTransaction(config, {
			data: ans2.data as `0x${string}`,
			to: ans2.to as `0x${string}`,
		});
		console.log(burnResult);
		let burnTxreciept = await waitForTransaction(burnResult);
		console.log({ burnTxreciept });
		console.log("middle2");
		let ans3 = await msgBytes(burnResult);
		console.log({ ans3 });
		console.log("middle3");
		let { messageBytes, attestationSignature}=await checkAttestation(
			ans3.messageBytes as string,
			ans3.messageHash as string
		);
    // let tempAs="0x202dc0ba08a670a66d51f7cd549666df5c61d3112df2a614d3c1097d404326665298f9a420c0ec5557279f71756c1d05e92c5f93fbb7ef2fd38fe6e16f5261891b945bd46f81193b5c6bd6ccad7a739cdaa5d0703cc685886b315fa7dfe059242c7f2673bf3fa0bba9f0a62bc023642bbc557e1653f153948e01bd9f90dc8080fc1c"
    // let tempmb="0x000000000000000000000005000000000004038d0000000000000000000000009f3b8679c73c2fef8b59b4f3444d4e156fb70aa5a65fc943419a5ad590042fd67c9791fd015acf53a54cc823edb8ff81b9ed722e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c7238f70b88104c0d098f26f36e579ac48946a2d153c87cf0cb647b143f6eab19ec980000000000000000000000000000000000000000000000000000000000000001000000000000000000000000193e11d9848c74642d55aa22e61b914f8ff11510"


    let _txsig=await recieveSol(messageBytes as string, attestationSignature as string,provider,user?.blockchainAddress as string,userata)
    if(_txsig){
      
      setTxSig(_txsig)
      setIsLoading(false)
      
      setShowSuccessPopUp(true)
    }
    console.log("end")

		console.log("end");
	};
	const waitForTransaction = async (txHash: any) => {
		let web3 = new Web3(ETH_TESTNET_RPC);
		let transactionReceipt = await web3.eth
			.getTransactionReceipt(txHash)
			.catch((err) => {
				console.log("tx pending");
			});
		console.log({ transactionReceipt });
		while (
			transactionReceipt == undefined ||
			transactionReceipt.status.toString() === "FALSE"
		) {
			console.log("here");
			transactionReceipt = await web3.eth
				.getTransactionReceipt(txHash)
				.catch((err) => {
					console.log("tx pending");
				});
			await new Promise((r) => setTimeout(r, 4000));
		}
		return transactionReceipt;
	};
  useEffect(() => {
    setIsClient(true)
  }, [])
  return (
    <div className="flex flex-col gap-[15px] items-center w-full bg-white rounded-[30px] p-8 sm:shadow-[0_12px_34px_-10px_rgba(58, 77, 233, 0.15)]">
      <div className="flex gap-4 justify-between w-full">
        {["Deposit", "Withdraw"].map((text, index) => (
          <div
            key={index}
            onClick={() => togglePaymentMethod(index)}
            className={`${activeSection === index ? "bg-[#222222] text-base text-white" : "bg-[#2222221A] text-[15px] text-[#222222]"} rounded-[30px] p-[10px] text-center cursor-pointer w-full`}
          >
            {text}
          </div>
        ))}
      </div>
      <div className="flex flex-col text-[#838187] text-[14px] w-full">
        {activeSection!=2 && (<p>Choose your payment method</p>)}
        
        {activeSection==2 && (<div className="h-full w-full  bg-gray-200">
          {(showSuccessPopUp || showFailurePopUp) && <SuccessModal errorMessages={errorMessages} tx={txSig} isSuccess={showSuccessPopUp} closePopUp={() => {
                  showFailurePopUp ? setShowFailurePopUp(false) : setShowSuccessPopUp(false)
                }} />}
           <form className="max-w-sm mx-auto">
            <div className="mb-5">
              <label htmlFor="USDC" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">USDC ETH</label>
              <input type="USDC" id="USDC" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"  />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">USDC SOl</label>
              <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"  />
            </div>
            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"  />
              </div>
              
            </div>
            <button onClick={(e)=>console.log(e)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
          </form>
          
                  </div>)}
      </div>
      <div className="flex flex-col gap-6 w-full">
        <Accordion
          selectedMethod={selectedMethod}
          setSelectedMethod={handleSelection}
          activeSection={activeSection}
        />
        {activeSection === 0 && !selectedMethod.name && (
          <div>
            <LoadingButton
              isLoading={false}
              className="w-full h-[39px] py-[16px] bg-[#0653EA] cursor-pointer text-white flex items-center justify-center rounded-lg text-[15px]"
              onClick={""}
            >
              Deposit
            </LoadingButton>
            <div className="flex items-center gap-[15px] p-[15px] bg-[#F2F2F2] mt-4 ">
              <div className="w-6 h-6">
                <WarningIcon />
              </div>
              <p className="text-[#222222] sm:text-[14px] font-normal w-full">
                Funds may be irrecoverable if you enter an incorrect wallet ID.
                It is crucial to ensure the accuracy of the provided ID to avoid
                any loss.
              </p>
            </div>
            <Link
              target="_blank"
              href="https://help.sky.trade/article/how-to-buy-usdc-on-the-solana-network-a-simple-guide"
            >
              <div className="flex items-center gap-[5px] mt-4 ">
                <div className="w-6 h-6">
                  <QuestionMarkIcon />
                </div>
                <p className="text-[#0000FF] text-[14px]">
                  Simple Guide to Buy USDC on the Solana Network
                </p>
              </div>
            </Link>
          </div>
        )}

        {(selectedMethod.name === "Stripe" ||
          selectedMethod.name === "Ramp" ||
          selectedMethod.name === "LI.FI" ||
          selectedMethod.name === "Transak") &&
          activeSection === 0 && (
            <div>
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
              <div className="flex bg-[#DFF1FF] w-full justify-between rounded-lg mt-4">
                <input
                  className="text-[#222222] text-[10px] sm:text-[13px] rounded-lg w-full py-[14px] pl-[20px] focus:outline-none"
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
              <hr className="sm:hidden border border-black border-opacity-20 h-[1px] w-full" />
              <div className="flex items-center gap-[15px] p-[15px] bg-[#F2F2F2] mt-4">
                <div className="w-6 h-6">
                  <WarningIcon />
                </div>
                <div className="text-[#222222] sm:text-[14px] font-normal w-[341px]">
                  <div>
                    Funds may be irrecoverable if you enter an incorrect wallet
                    ID. It is crucial to ensure the accuracy of the provided ID
                    to avoid any loss.
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
                </div>
              </div>
              <Link
                target="_blank"
                href="https://help.sky.trade/article/how-to-buy-usdc-on-the-solana-network-a-simple-guide"
              >
                <div className="flex items-center gap-[5px] mt-4 ">
                  <div className="w-6 h-6">
                    <QuestionMarkIcon />
                  </div>
                  <p className="text-[#0000FF] text-[14px]">
                    Simple Guide to Buy USDC on the Solana Network
                  </p>
                </div>
              </Link>
            </div>
          )}
      </div>
      {selectedMethod.name === "Native" && activeSection === 0 && (
        <div>
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
      {(activeSection === 0 && selectedMethod.name=="Swap") && (
        <>
          <div className="flex items-center justify-between w-full ">
            <div className="flex flex-col items-start gap-[5px] flex-1">
             <ConnectKitButton /> 
             <button onClick={handleDepositWithdraw} className="text-center text-black px-8 py-1 bg-gray-200 tracking-wider hover:bg-black hover:text-white rounded-xl">
              Submit
             </button>
              
            </div>
            <div className="w-[72px] h-[72px] bg-cover bg-no-repeat bg-center ">
             
            </div>
            
          </div>
          <div className="flex bg-[#DFF1FF] w-full justify-between rounded-lg">
             
                
            </div>
                <hr className=" sm:hidden border border-black border-opacity-20 h-[1px]  w-full"/>
          
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
      </>
    )}

    </div>
  );
};
export default DepositAndWithdraw;
