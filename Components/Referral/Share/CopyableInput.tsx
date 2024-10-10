import React, { ChangeEvent, MouseEvent } from "react";
import { BalanceLoader } from "@/Components/Wrapped";

interface CopyableInputProps {
  isLoading?: boolean;
  value: string;
  isCopied?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  canCopy?: boolean;
  canChangeCode?: boolean;
  handleCopy: (e: MouseEvent) => void;
  handleOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpdateReferralCode?: () => void;
  isReferralLink?: boolean;
}

const CopyableInput: React.FC<CopyableInputProps> = ({
  value,
  isCopied,
  readOnly,
  disabled,
  canCopy,
  canChangeCode,
  handleCopy,
  handleOnChange,
  handleUpdateReferralCode,
  isLoading,
  isReferralLink = true,
}) => (
  <div className="relative w-full md:w-[300px]">
    {isLoading ?
      <div className="flex items-center py-[18px]">
        <BalanceLoader />
      </div>
    : <input
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={handleOnChange}
        maxLength={6}
        className="w-[97%] rounded-lg bg-[#DFF1FF] px-[22px] py-[14px] pr-[95px] text-[14px] text-[#222222] focus:outline-none"
        type="text"
        name="myReferralCode"
        id="myReferralCode"
      />
    }

    {canCopy && (
      <p
        onClick={handleCopy}
        className="absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer text-[14px] text-[#0653EA]"
      >
        {isCopied ?
          "Copied ✓"
        : isReferralLink ?
          "Copy code "
        : "Copy link"}
      </p>
    )}
    {canChangeCode && (
      <p
        onClick={handleUpdateReferralCode}
        className="absolute right-[22px] top-1/2 -translate-y-1/2 cursor-pointer text-[14px] text-[#0653EA]"
      >
        {"Update code"}
      </p>
    )}
  </div>
);

export default CopyableInput;
