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