import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

import { setUserUSDWalletBalance } from "@/redux/slices/userSlice";
import axios from "axios";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { User } from "@/types";
import { fetchBalance } from "@/utils/fetchBalance";

const useFetchBalance = () => {
  const { user, web3authStatus } = useAuth();
  const dispatch = useAppDispatch();

  const { userUSDWalletBalance } = useAppSelector((state) => {
    const { userUSDWalletBalance } = state.userReducer;
    return { userUSDWalletBalance };
  }, shallowEqual);

  const handleBalance = async () => {
    try {
      const userBalance = await fetchBalance(user);

      dispatch(
        setUserUSDWalletBalance({
          amount: userBalance,
          isLoading: false,
        }),
      );
    } catch (error) {
      dispatch(
        setUserUSDWalletBalance({
          amount: userUSDWalletBalance.amount,
          isLoading: false,
        }),
      );
    }
  };

  useEffect(() => {
    if (user && user.blockchainAddress) {
      handleBalance();
    }
  }, [user, web3authStatus]);

  return null;
};

export default useFetchBalance;
