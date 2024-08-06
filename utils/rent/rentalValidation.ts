import { toast } from "react-toastify";

export const validateRental = (currentDate: Date, startDate: Date, endDate: Date, tokenBalance: string,setFinalAns:React.Dispatch<React.SetStateAction<{status:string;message:string;tokenId?:string;}>>,setShowSuccess:React.Dispatch<React.SetStateAction<boolean>>): boolean => {
  if (currentDate > endDate) {
    toast.error("Rental Tokens can't be booked in the past");
    return false;
  }
  if (parseFloat(tokenBalance) < 2) {
    toast.error("Please deposit some funds into your wallet to continue");
    return false;
  }
  if (startDate.getMinutes() % 30 !== 0) {
    setFinalAns({
      status: "Rent failed",
      message: "Invalid time input. Please enter a time that is either a fixed hour or 30 minutes after the hour. For example, 1:00, 1:30, 2:00, 2:30, and so on.",
    });
    setShowSuccess(true);
    return false;
  }
  return true;
};
