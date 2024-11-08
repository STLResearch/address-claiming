"use client";

import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { CloseIconBlack, LocationPointIcon } from "../Icons";
import { PropertyData, StatusTypes } from "@/types";
import PropertiesService from "@/services/PropertiesService";
import { fetchMapboxStaticImage } from "@/utils/getMapboxStaticImage";
import Backdrop from "../Backdrop";
import LoadingButton from "../LoadingButton/LoadingButton";

interface ModalProps {
  airspace: PropertyData | null;
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAirspaceList: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  setSelectedAirspace: Dispatch<SetStateAction<null>>;
}

const CancelClaimModal = ({ airspace, setShowCancelModal, setSelectedAirspace, setAirspaceList }: ModalProps) => {
  const [imageUrl, setImagaeUrl] = useState("");

  const [inputValue, setInputValue] = useState(airspace?.address);
  const { unclaimProperty } = PropertiesService();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleCancelBtn = () => {
    setSelectedAirspace(null);
    setShowCancelModal(false);
    setLoading(true);
    setIsActive(true);
  };
  const handleUnclaim = async () => {
    await unclaimProperty(airspace?.id as number);
    setAirspaceList((prev) => {
      return prev.filter((p) => p.id !== airspace?.id);
    });
    setSelectedAirspace(null);
    setShowCancelModal(false);
    setLoading(true);
    setIsActive(false);
  };

  useEffect(() => {
    const handelAirspaceImage = async () => {
      const url = await fetchMapboxStaticImage(airspace?.latitude, airspace?.longitude);
      setImagaeUrl(url);
    };
    handelAirspaceImage();
  }, []);

  return (
    <Fragment>
      <Backdrop />
      <div className="fixed left-1/2 top-1/2 z-[500] flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-[15px] bg-white px-[29px] py-[30px] md:z-50 md:h-auto md:w-[689px] md:rounded-[30px]">
        <div
          className="relative -mx-[29px] -mt-[30px] flex items-center gap-[20px] px-[29px] py-[20px] md:mx-0 md:my-0 md:p-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <h2 className="mt-2 w-full text-center text-xl font-medium text-light-black md:mt-0">Cancel Claim</h2>
          <div onClick={handleCancelBtn} className="absolute right-0 top-0 m-4 h-[15px] w-[15px] cursor-pointer md:m-0">
            <CloseIconBlack />
          </div>
        </div>
        <div>Are you sure you want to cancel the claim of the following air rights?</div>

        <div className="flex items-center gap-[10px] rounded-lg border border-deep-blue px-[22px] py-4">
          <div className="h-6 w-6">
            <LocationPointIcon />
          </div>
          <input
            className="flex-1 border-none text-[14px] font-normal text-light-black outline-none"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>

        <div>
          <Image src={imageUrl} alt="Map" width={50} height={50} className="h-[130px] w-[631px] object-cover" />
        </div>
        <div className="-mx-[10px] -mb-[20px] mt-auto flex flex-col gap-[20px] px-[10px] py-[12px] md:mx-0 md:mb-0 md:mt-[15px] md:flex-row md:px-0 md:py-0">
          <LoadingButton
            onClick={handleCancelBtn}
            isLoading={loading}
            color=""
            className={`w-full rounded-[5px] text-[11.89px] md:flex-1 ${isActive ? "bg-[#0653EA] text-white" : "bg-white text-[#0653EA]"} flex cursor-pointer items-center justify-center border border-[#0653EA] px-[20px] py-[10px] text-center ${isActive ? "hover:bg-white hover:text-[#0653EA]" : "hover:bg-[#0653EA] hover:text-white"}`}
          >
            No, I want to keep my claim
          </LoadingButton>

          <LoadingButton
            onClick={handleUnclaim}
            isLoading={loading}
            color=""
            className={`w-full rounded-[5px] text-[11.89px] md:flex-1 ${isActive ? "bg-white text-[#0653EA]" : "bg-[#0653EA] text-white"} flex cursor-pointer items-center justify-center border border-[#0653EA] px-[20px] py-[10px] text-center ${isActive ? "hover:bg-[#0653EA] hover:text-white" : "hover:bg-[#0653EA] hover:text-white"}`}
          >
            Yes, I confirm I want to cancel my claim
          </LoadingButton>
        </div>
      </div>
    </Fragment>
  );
};

export default CancelClaimModal;
