import React, { useContext, useEffect, useState } from "react";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BalanceLoader } from "../../Components/Wrapped";
import { RefreshBalanceIcon, WalletIcon } from "../../Components/Icons";
import { Web3authContextType } from "../../types";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUserUSDWalletBalance } from "@/redux/slices/userSlice";
import useAuth from "@/hooks/useAuth";
import { Web3authContext } from "@/providers/web3Provider";
import { fetchBalance, fetchsolbalance } from "@/utils/fetchBalance";

const AvailableBalance = () => {
  const [solbalance, setSolBalance] = useState<number>(0);
  const { provider } = useContext(Web3authContext) as Web3authContextType;
  const { user, web3authStatus } = useAuth();
  const dispatch = useAppDispatch();
  const userUSDWalletBalance = useAppSelector((state) => state.userReducer.userUSDWalletBalance);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleBalance = async () => {
    try {
      const userBalance = await fetchBalance(user);

      dispatch(
        setUserUSDWalletBalance({
          amount: userBalance,
          isLoading: false,
        })
      );
    } catch (error) {
      dispatch(
        setUserUSDWalletBalance({
          amount: userUSDWalletBalance.amount,
          isLoading: false,
        })
      );
    }
  };

  const handleSolBal = async () => {
    if (user && provider) {
      const userBalance = await fetchsolbalance(provider);
      setSolBalance(userBalance);
    }
  };
  useEffect(() => {
    handleSolBal().catch(console.error);
  }, [solbalance, user, web3authStatus]);

  const handelRefreshButton = () => {
    setIsSpinning(true);

    handleBalance();
    handleSolBal();

    setTimeout(() => {
      setIsSpinning(false);
    }, 5000);
  };

  return (
    <div
      className="relative flex w-full items-center justify-between rounded-[30px] bg-white px-[20px] py-[37px] sm:px-[32px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <p className="text-xl font-medium text-[#222222]">Available Balance</p>
            <div onClick={handelRefreshButton} className={isSpinning ? "spin" : ""} style={{ cursor: "pointer" }}>
              <RefreshBalanceIcon />
            </div>
          </div>
          <div className="flex items-center justify-center rounded-[50%] bg-[#CCE3FC] p-[10px] sm:hidden">
            <div className="h-6 w-6 sm:hidden">
              <WalletIcon isActive={true} />
            </div>
          </div>
        </div>
        {userUSDWalletBalance.isLoading ?
          <div className="my-4">
            <BalanceLoader />
          </div>
        : <>
            <p className="text-3xl font-medium text-[#4285F4]">${userUSDWalletBalance.amount}</p>
            <div className="flex">
              <p className="text-sml font-normal leading-[21px] text-[#838187]">
                {/* {`Solana Balance ${parseFloat(solbalance / LAMPORTS_PER_SOL)}`} */}
                {`Solana Balance ${parseFloat((solbalance / LAMPORTS_PER_SOL).toString())}`}
              </p>
            </div>
          </>
        }
      </div>
      <div className="right-[9px] top-3 hidden items-center justify-center rounded-[50%] bg-[#CCE3FC] p-[10px] sm:absolute sm:flex">
        <div className="h-6 w-6">
          <WalletIcon isActive={true} />
        </div>
      </div>
    </div>
  );
};

export default AvailableBalance;
