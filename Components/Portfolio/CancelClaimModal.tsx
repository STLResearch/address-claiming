"use client";

import React, { Fragment, useState } from "react";
import Image from "next/image";
import {  CloseIconBlack, LocationPointIcon } from "../Icons";


interface ModalProps {
  airspace: any;
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectAirspace: any
}

const CancelClaimModal = ({airspace,setShowCancelModal, selectAirspace}: ModalProps) => {

  const [inputValue, setInputValue] = useState(airspace?.address);

  return (
    <Fragment>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full h-full md:h-auto md:w-[689px] z-[500] md:z-50 flex flex-col gap-[15px]">
        <div
          className="relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
        <h2 className="text-light-black text-center font-medium text-xl w-full">
          Cancel Claim
        </h2>
        <div  onClick={() => {selectAirspace(true); setShowCancelModal(false)}} className="absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer">
          <CloseIconBlack />
        </div>
      </div>
        <div>Are you sure you want to cancel the claim of the following airspace?</div>

        <div className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg border border-deep-blue">
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <input
            className="font-normal text-light-black text-[14px] flex-1 border-none outline-none"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>

       <div>
       <Image
        src="/images/CancelMap.svg"
        alt="Map"
        width={100}
        height={100}  
        className="w-full h-auto object-cover "
      />
       </div>
      <div className="flex gap-[20px] md:mt-[15px] mt-auto -mx-[30px] md:mx-0 md:mb-0 -mb-[30px] px-[14px] md:px-0 py-[16px] md:py-0">
        <button   onClick={() => {selectAirspace(true); setShowCancelModal(false)}}  className="text-[11.89px] flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center border border-[#0653EA] hover:bg-[#0653EA] hover:text-white">
        No, I want to keep my claim
        </button>
      
          <button  className="text-[11.89px] flex-1 text-[#0653EA] rounded-[5px] bg-white text-center px-[10px] cursor-pointer flex items-center justify-center border border-[#0653EA] hover:bg-[#0653EA] hover:text-white">
            Yes, I confirm I want to cancel my claim
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default CancelClaimModal;