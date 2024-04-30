import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import { useDispatch } from "react-redux";
import { setUserUSDWalletBalance } from "@/redux/slices/userSlice";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";

const useFetchBalance = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  const {userUSDWalletBalance} = useSelector((state) => {
    const {userUSDWalletBalance} = state.userReducer;
    return {userUSDWalletBalance}
  }, shallowEqual);

  useEffect(() => {
    if (user && user.blockchainAddress) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.post(process.env.NEXT_PUBLIC_SOLANA_API, {
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
          });
          const value = response.data.result.value;
          if (value.length < 1) dispatch(setUserUSDWalletBalance({amount: '0', isLoading: false}));
          else dispatch(setUserUSDWalletBalance({
            amount: value[0].account.data.parsed.info.tokenAmount.uiAmountString,
            isLoading: false
          }));
        } catch (error) {
          console.error(error);
          dispatch(setUserUSDWalletBalance({
            amount: userUSDWalletBalance.amount,
            isLoading: false
          }));
        } 
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user?.blockchainAddress]);


  return null;
};

export default useFetchBalance;