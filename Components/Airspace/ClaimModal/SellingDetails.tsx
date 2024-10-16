import React, { useState } from "react";
import Link from "next/link";
import { InfoIcon } from "../../Icons";

interface SellingDetailsProps {
  sellingPrice: string | undefined;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const SellingDetails: React.FC<SellingDetailsProps> = ({
  sellingPrice,
  setData,
}) => {
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
        <h2 className="text-[#222222] font-normal text-[20px]">
          Selling Details
        </h2>
        <div
          onClick={() => setIsInfoVisible((prev) => !prev)}
          className="relative w-[20px] h-[20px] flex justify-center items-center"
        >
          {/* Assuming InfoIcon is an SVG or an imported component */}
          <InfoIcon />
          {isInfoVisible && (
            <div className="absolute -top-4 left-6 w-[189px] bg-[#CCE3FC] rounded-[4px] p-[12px] font-normal text-[10px] italic">
              Note that rental availability is not applicable to your selling
            </div>
          )}
        </div>
      </div>
      <Link
        href={"https://skytrade.tawk.help"}
        className="text-[#0653EA] text-[14px] font-normal cursor-pointer"
      >
        Learn more about selling in our FAQ.
      </Link>
      <div className="flex flex-col gap-[5px]">
        <label
          className="font-normal text-[#838187] text-[14px]"
          htmlFor="sellingPrice"
        >
          Selling Price
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center text-[14px] pl-[22px] text-[#222222] ">
            $
          </span>
          <input
            className="rounded-lg pl-[31px] w-full py-[16px] text-[14px] text-[#222222] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
