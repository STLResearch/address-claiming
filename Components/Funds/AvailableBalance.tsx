import React from "react";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BalanceLoader } from "../../Components/Wrapped";
import { WalletIcon } from "../../Components/Icons";
import { AvailableBalanceProps, RootState } from "../../types";
import { useAppSelector } from "@/redux/store";

const AvailableBalance = ({ solbalance }: AvailableBalanceProps) => {
  const { userUSDWalletBalance } = useAppSelector((state) => {
    const { userUSDWalletBalance } = state.userReducer;
    return { userUSDWalletBalance };
  });

  return (
    <div
      className="relative bg-white flex items-center px-[20px] sm:px-[32px] py-[37px] rounded-[30px] justify-between w-[89%] sm:w-[468px]"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex flex-col justify-between w-full h-full ">
        <div className="flex justify-between">
          <p className="text-xl font-medium text-[#222222]">
            Available Balance
          </p>
          <div className="sm:hidden  rounded-[50%] bg-[#CCE3FC] flex items-center justify-center p-[10px]">
            <div className="sm:hidden h-6 w-6">
              <WalletIcon isActive={true} />
            </div>
          </div>
        </div>
        {userUSDWalletBalance.isLoading ? (
          <div className="my-4">
            <BalanceLoader />
          </div>
        ) : (
          <>
            <p className="text-3xl text-[#4285F4] font-medium">
              ${userUSDWalletBalance.amount}
            </p>
            <div className="flex">
              <p className=" text-sml text-[#838187] font-normal leading-[21px]">
                {/* {`Solana Balance ${parseFloat(solbalance / LAMPORTS_PER_SOL)}`} */}
                {`Solana Balance ${parseFloat((solbalance / LAMPORTS_PER_SOL).toString())}`}
              </p>
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

export default AvailableBalance;
