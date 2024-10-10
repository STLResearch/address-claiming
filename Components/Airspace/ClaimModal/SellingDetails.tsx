import React, { useState } from "react";
import Link from "next/link";
import { InfoIcon } from "../../Icons";

interface SellingDetailsProps {
  sellingPrice: string | undefined;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const SellingDetails: React.FC<SellingDetailsProps> = ({ sellingPrice, setData }) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const handleSellPrice = (e) => {
    const inputVal = e.target.value;
    const parsedVal = parseFloat(inputVal);
    if (parsedVal >= 0 && !Number.isNaN(parsedVal)) {
      setData((prev) => {
        return {
          ...prev,
          sellingPrice: inputVal,
        };
      });
    } else {
      setData((prev) => {
        return {
          ...prev,
          sellingPrice: "0",
        };
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-[7.5px]">
        <h2 className="text-[20px] font-normal text-[#222222]">Selling Details</h2>
        <div
          onClick={() => setIsInfoVisible((prev) => !prev)}
          className="relative flex h-[20px] w-[20px] items-center justify-center"
        >
          {/* Assuming InfoIcon is an SVG or an imported component */}
          <InfoIcon />
          {isInfoVisible && (
            <div className="absolute -top-4 left-6 w-[189px] rounded-[4px] bg-[#CCE3FC] p-[12px] text-[10px] font-normal italic">
              Note that rental availability is not applicable to your selling
            </div>
          )}
        </div>
      </div>
      <Link href={"https://skytrade.tawk.help"} className="cursor-pointer text-[14px] font-normal text-[#0653EA]">
        Learn more about selling in our FAQ.
      </Link>
      <div className="flex flex-col gap-[5px]">
        <label className="text-[14px] font-normal text-[#838187]" htmlFor="sellingPrice">
          Selling Price
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-[22px] text-[14px] text-[#222222]">$</span>
          <input
            className="w-full rounded-lg py-[16px] pl-[31px] text-[14px] text-[#222222] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ border: "1px solid #87878D" }}
            autoComplete="off"
            type="number"
            min={0}
            value={sellingPrice}
            onChange={handleSellPrice}
            name="sellingPrice"
            id="sellingPrice"
          />
        </div>
      </div>
    </>
  );
};

export default SellingDetails;
