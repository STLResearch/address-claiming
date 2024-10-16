import { ComputeBudgetProgram } from "@solana/web3.js";

export const checkNameIsValid = (name) => {
  return !!name;
};

export const checkPhoneIsValid = (phoneNumber) => {
  return !(
    !phoneNumber ||
    isNaN(+phoneNumber.slice(1)) ||
    phoneNumber.charAt(0) !== "+"
  );
};

export const checkReferralCodeIsValid = (referralCode) => {
  return true;
};

export const getPriorityFeeIx = async (connection) => {
  const fees = await connection.getRecentPrioritizationFees();
  const maxPrioritizationFee = fees.reduce((max, cur) => {
    return cur.prioritizationFee > max.prioritizationFee ? cur : max;
  }, fees[0]);

  const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: maxPrioritizationFee.prioritizationFee,
  });

  return PRIORITY_FEE_IX;
};

export const getTokenLink = (tokenId) => {
  if (process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME === "devnet") {
    return `https://solscan.io/token/${tokenId}?cluster=devnet`;
  }
  return `https://solscan.io/token/${tokenId}`;
};

export const getTransactionLink = (signature) => {
  if (process.env.NEXT_PUBLIC_SOLANA_DISPLAY_NAME === "devnet") {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
  }
  return `https://solscan.io/tx/${signature}`;
};
