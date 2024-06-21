import React, { Fragment, ChangeEvent } from "react";

interface PropsI {
  fee: string;
  setFee: (fee: string) => void;
}

const VariableFeeRentalRangesSelect = ({ fee, setFee }: PropsI) => {
  const handleVariableFeeRentalRangeChange = (event) => {
    const selectedFee = event.target.value;
    setFee(selectedFee);
  };

  return (
    <Fragment>
      <label
        htmlFor="variableFeeRentalRange"
        className="text-[14px] font-normal text-[#838187] leading-[2rem] "
      >
        Variable Fee Rental Range (per transit)
        <span className="text-[#E04F64]">*</span>
      </label>
      <select
        value={fee}
        onChange={handleVariableFeeRentalRangeChange}
        name="variableFeeRentalRange"
        id="variableFeeRentalRange"
        className="w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none "
        style={{ border: "1px solid #87878D" }}
      >
        <option value="1-99">$1-$99</option>
        <option value="100-199">$100-$199</option>
        <option value="200-299">$200-$299</option>
        <option value="300-399">$300-$399</option>
        <option value="400-499">$400-$499</option>
        <option value="500-599">$500-$599</option>
      </select>
    </Fragment>
  );
};


export default VariableFeeRentalRangesSelect;
