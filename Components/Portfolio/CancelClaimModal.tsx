"use client";

import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { CloseIconBlack, LocationPointIcon } from "../Icons";
import { PropertyData, StatusTypes } from "@/types";
import PropertiesService from "@/services/PropertiesService";
import { fetchMapboxStaticImage } from "@/utils/getMapboxStaticImage";
import Backdrop from "../Backdrop";
import LoadingButton from "../LoadingButton/LoadingButton";

interface ModalProps {
  airspace: PropertyData;
  setShowCancelModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAirspaceList: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  setSelectedAirspace: Dispatch<SetStateAction<null>>;
}

const CancelClaimModal = ({
  airspace,
  setShowCancelModal,
  setSelectedAirspace,
  setAirspaceList,
}: ModalProps) => {
  const [imageUrl, setImagaeUrl] = useState("");

  const [inputValue, setInputValue] = useState(airspace?.address);
  const { unclaimProperty } = PropertiesService();
  const [loading, setLoading] = useState(false);

  const handleCancelBtn = () => {
    setSelectedAirspace(null);
    setShowCancelModal(false);
    setLoading(true);
  };
  const handleUnclaim = async () => {
    await unclaimProperty(airspace?.id as number);
    setAirspaceList((prev) => {
      return prev.filter((p) => p.id !== airspace?.id);
    });
    setSelectedAirspace(null);
    setShowCancelModal(false);
    setLoading(true);
  };

  useEffect(() => {
    const handelAirspaceImage = async () => {
      const url = await fetchMapboxStaticImage(
        airspace.latitude,
        airspace.longitude,
      );
      setImagaeUrl(url);
    };
    handelAirspaceImage();
  }, []);

  return (
    <Fragment>
      <Backdrop />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full h-full md:h-auto md:w-[689px] z-[500] md:z-50 flex flex-col gap-[15px]">
        <div
          className="relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <h2 className="text-light-black text-center font-medium text-xl w-full md:mt-0 mt-2 ">
            Cancel Claim
          </h2>
          <div
            onClick={handleCancelBtn}
            className="absolute top-0 right-0 w-[15px] h-[15px] md:m-0 m-4 cursor-pointer"
          >
            <CloseIconBlack />
          </div>
        </div>
        <div>
          Are you sure you want to cancel the claim of the following air rights?
        </div>

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
            src={imageUrl}
            alt="Map"
            width={50}
            height={50}
            className="w-[631px] h-[130px] object-cover "
          />
        </div>
        <div className="flex flex-col md:flex-row gap-[20px] md:mt-[15px] mt-auto -mx-[10px] md:mx-0 md:mb-0 -mb-[20px] px-[10px] md:px-0 py-[12px] md:py-0">
          <LoadingButton
            onClick={handleCancelBtn}
            isLoading={loading}
            color=""
            className="text-[11.89px] w-full md:flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center border border-[#0653EA] hover:bg-[#0653EA] hover:text-white"
          >
            No, I want to keep my claim
          </LoadingButton>

          <LoadingButton
            onClick={handleUnclaim}
            isLoading={loading}
            color=""
            className="text-[11.89px] w-full md:flex-1 text-[#0653EA] rounded-[5px] bg-white text-center py-[10px] px-[20px] cursor-pointer flex items-center justify-center border border-[#0653EA] hover:bg-[#0653EA] hover:text-white"
          >
            Yes, I confirm I want to cancel my claim
          </LoadingButton>
        </div>
      </div>
    </Fragment>
  );
};

export default CancelClaimModal;
