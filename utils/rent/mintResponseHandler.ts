import React from "react";

import { RentTokenResponse } from "@/types";
import { toast } from "react-toastify";

export const handleMintResponse = async (
  response: RentTokenResponse,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setShowSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setFinalAns: React.Dispatch<
    React.SetStateAction<{
      status: string;
      message: string | undefined;
      tokenId?: string;
    }>
  >
) => {
  if (response && response?.statusCode === 500) {
    toast.error(response.message);
    setIsLoading(false);
    return false;
  }
  if (response.statusCode === 400) {
    setShowSuccess(true);
    setFinalAns({
      status: "Rent failed",
      message: response.errorMessage,
    });
    setIsLoading(false);
    return false;
  }
  return true;
};
