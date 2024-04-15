import { ComputeBudgetProgram } from "@solana/web3.js"
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk"
import { toast } from "react-toastify";


export const checkNameIsValid = (name) => {
  return !!name;
}

export const checkPhoneIsValid = (phoneNumber) => {
  return !(!phoneNumber || isNaN(+(phoneNumber.slice(1,))) || phoneNumber.charAt(0) !== '+')
}

export const checkReferralCodeIsValid = (referralCode) => {
  return true;
}

export const getPriorityFeeIx = async (connection) => {
  let fees = await connection.getRecentPrioritizationFees();
  let maxPrioritizationFee = fees.reduce((max, cur) => {
    return cur.prioritizationFee > max.prioritizationFee ? cur : max;
  }, fees[0]);

  const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: maxPrioritizationFee.prioritizationFee,
  });

  return PRIORITY_FEE_IX;
};


export const showRampDepositeAndWithdrawal = (rampOption, walletId) => {
  switch (rampOption) {
    case "withdrawal": {
      new RampInstantSDK({
        hostAppName: 'SKYTRADE APP',
        hostLogoUrl: String(process.env.RAMP_TEST_LOGOURL),
        hostApiKey: String(process.env.RAMP_TEST_APIKEY),
        defaultAsset: 'SOLANA_USDC',
        userAddress: String(walletId)
      }).show().on('*', (event) => {
        if (event.type === 'OFFRAMP_SALE_SUCCESS') {
          toast.success("Success !. Your funds have been withdrawn successfully");
        } else if (event.type === 'OFFRAMP_SALE_FAILED') {
          toast.success('Withdrawal failed');
        }
      });
      break;
    }
    case "deposit": {
      new RampInstantSDK({
        hostAppName: 'SKYTRADE APP',
        hostLogoUrl: String(process.env.RAMP_TEST_LOGOURL),
        hostApiKey: String(process.env.RAMP_TEST_APIKEY),
        defaultAsset: 'SOLANA_USDC',
        userAddress: String(walletId)
      }).show().on('*', (event) => {
        if (event.type === 'PURCHASE_SUCCESS') {
          toast.success("Success !. Your USDC have been purchased successfully");
        } else if (event.type === 'PURCHASE_FAILED') {
          toast.success('Purchase failed');
        }
      });
      break;
    }

  }
}