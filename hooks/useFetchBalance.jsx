import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

import { useDispatch } from "react-redux";
import { setUserUSDWalletBalance } from "@/redux/slices/userSlice";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { counterActions } from "@/store/store";

const useFetchBalance = () => {
  const { user, web3authStatus } = useAuth();
  const dispatch = useDispatch();

  // const {userUSDWalletBalance} = useSelector((state) => {
  //   const {userUSDWalletBalance} = state.userReducer;
  //   return {userUSDWalletBalance}
  // }, shallowEqual);

  const userUSDWalletBalance = useSelector(
    (state) => state.value.userUSDWalletBalance
  );

  useEffect(() => {
    if (user && user.blockchainAddress) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_SOLANA_API,
            {
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
            }
          );
          const value = response.data.result.value;
          if (value.length < 1)
            dispatch(
              counterActions.setUserUSDWalletBalance({
                amount: "0",
                isLoading: false,
              })
            );
          else
            dispatch(
              counterActions.setUserUSDWalletBalance({
                amount:
                  value[0].account.data.parsed.info.tokenAmount.uiAmountString,
                isLoading: false,
              })
            );
        } catch (error) {
          console.error(error);
          dispatch(
            counterActions.setUserUSDWalletBalance({
              amount: userUSDWalletBalance.amount,
              isLoading: false,
            })
          );
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user, web3authStatus]);

  return null;
};

export default useFetchBalance;
