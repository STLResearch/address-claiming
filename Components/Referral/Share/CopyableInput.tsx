import { BalanceLoader } from "@/Components/Wrapped";
import { ChangeEvent, MouseEvent } from "react";

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
    {isLoading ? (
      <div className="flex items-center py-[18px]">
        <BalanceLoader />
      </div>
    ) : (
      <input
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={handleOnChange}
        maxLength={6}
        className="bg-[#DFF1FF] text-[#222222] text-[14px] rounded-lg w-[97%] py-[14px] px-[22px] focus:outline-none pr-[95px]"
        type="text"
        name="myReferralCode"
        id="myReferralCode"
      />
    )}

    {canCopy && (
      <p
        onClick={handleCopy}
        className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer"
      >
        {isCopied ? "Copied ✓" : isReferralLink ? "Copy code " : "Copy link"}
      </p>
    )}
    {canChangeCode && (
      <p
        onClick={handleUpdateReferralCode}
        className="absolute right-[22px] top-1/2 -translate-y-1/2 text-[#0653EA] text-[14px] cursor-pointer"
      >
        {"Update code"}
      </p>
    )}
  </div>
);

export default CopyableInput;
