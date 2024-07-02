import { FC } from "react";
import React from "react";
import { FailedVerificationIcon, ReviewVerificationIcon,VerificationIcon } from "../Icons";

interface AccountVerificationProps {
  KYCStatusId: number;
  isLoading: boolean;
  onVerifyMyAccount: () => void;
}
const AccountVerification = ({
  KYCStatusId,
  isLoading,
  onVerifyMyAccount,
}: AccountVerificationProps) => {
  return (
 <div>
   {KYCStatusId === 0 && (
    <div className="flex w-full rounded-[30px] gap-[15px] bg-white" style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }} >
    <div className="md:w-[50%]  p-6  flex flex-col justify-center items-center md:gap-6 gap-4">
      <h1 className="text-xl font-medium text-[#222222]  text-center">🚀 Attention Airspace Owner!</h1>
      <h1 className="text-xl font-medium text-[#222222] block md:hidden">Account verification</h1>
      <p className="text-sm font-normal text-[#838187] text-center leading-6">Your airspace awaits verification by our operation team. Your account is not verified. We verify the identity of our customers to assess potential risks, prevent fraud, and comply with legal and regulatory requirements. Complete your KYC to expedite the process and ensure swift approval. Plus,<span className="text-[#87878D] text-sm font-bold" > earn 10 SKY points </span> as a token of our appreciation! Don't delay - verify now and unlock the full potential of your airspace!</p>
      {!isLoading && (
        <button  onClick={onVerifyMyAccount}  className="text-sm font-medium w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Verify my identity Now</button>
      )}
    </div>
      <div className="hidden md:block md:w-[50%]">
        <img
          src="/images/portfolio.png"
          alt="Verification Image"
          className="h-full w-full object-cover rounded-r-[30px]"
        />
      </div>
    </div>
  )}

 {KYCStatusId === 1 && (
      <div
      className="flex flex-col py-[17px] md:px-[25px] px-[20px] rounded-[30px] gap-[15px] bg-white" style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#222222]">
          Account verification
        </h2>
      <div>
       <ReviewVerificationIcon/>
      </div>
      </div>
        <p className="font-normal text-base text-[#87878D]">
        Your account verification is currently under review. This step is crucial for security and compliance reasons. Please await confirmation to enjoy full access to our services. Rest assured, your data is securely handled. If you have any questions, feel free to contact our support team. Thank you for your patience.
        </p>
        <h1 className="text-[#87878D] text-base font-bold">
        Once your KYC verification is successfully completed, you'll instantly earn 10 SKY points.
        </h1>
        </div>
    )}

 {KYCStatusId === 2 && (
    <div className="flex flex-col py-[17px] md:px-[25px] px-[20px] rounded-[30px] gap-[15px] bg-white" style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }} >
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-medium text-[#222222]">
        Account verification
      </h2>
      <div>
        <VerificationIcon/>
      </div>
    </div>
    <p className="font-normal text-base text-[#87878D]">
     Thank you, your account is successfully verified. We verify the identity of our customers to assess potential risks, prevent fraud, and comply with legal and regulatory requirements. Note that we store your data securely with advanced encryption and strict authentication measures to ensure utmost privacy and protection.
    </p>
    <h1 className="text-[#87878D] text-base font-bold">
    You've instantly earned 10 SKY points. Check your SKY points balance on the referrral page.
    </h1>
   </div>
)}

{KYCStatusId === 5 && (
    <div className="flex flex-col py-[17px] md:px-[25px] px-[20px] rounded-[30px] gap-[15px] bg-white"  style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }} >
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-medium text-[#222222]">
        Account verification
      </h2>
      <div>
        <FailedVerificationIcon/>
      </div>
    </div>
    <p className="font-normal text-base text-[#87878D]">
      We regret to inform you that your recent account verification attempt was unsuccessful. To access our services fully, please attempt verification again. Reach out to our support team for assistance. Thank you for your understanding.
    </p>
    <button className="font-medium text-base text-[#0653EA] text-right flex-1 cursor-pointer"
          disabled={isLoading}
          onClick={onVerifyMyAccount} >
          Verify my account
    </button>
  </div> 

)}
</div>

  );
};

export default AccountVerification;

