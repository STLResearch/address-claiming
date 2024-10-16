import React, { Fragment, useEffect, useState, useRef } from "react";
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import useAuth from "../../../hooks/useAuth";
import {
  ArrowLeftIcon,
  CloseIconBlack,
  InfoIcon,
  LocationPointIcon,
  DropDownIcon,
} from "../../../Components/Icons";
import Link from "next/link";
import VariableFeeRentalRangesSelect from "./RentalDetails/VariableFeeRentalRangesSelect";
import TimeZoneSelect from "./RentalDetails/TimeZoneSelect";
import WeekDayRangesForm from "./RentalDetails/WeekDayRangesForm";
import { useTour } from "@reactour/tour";
import { useSearchParams } from "next/navigation";
import Backdrop from "@/Components/Backdrop";
import VerificationPopup from "@/Components/MyAccount/VerificationPopup";
import { defaultData, PropertyData } from "../../../types";
import { useMobile } from "@/hooks/useMobile";
import { useDropzone, DropzoneRootProps } from "react-dropzone";
import { toast } from "react-toastify";
import { isFileSizeValid, uploadImage } from "@/utils/propertyUtils/fileUpload";
import RentalDetails from "./RentalDetails/RentalDetails";
import AirspacePhotoUpload from "./AirspacePhotoUpload";
import PlanningPermission from "./PlanningPermission/PlanningPermission";
import AirspaceOptions from "./AirspaceOptions/AirspaceOptions";
import S3UploadServices from "@/services/s3upload";
import ZoningPermission from "./PlanningPermission/ZoningPermission";

interface PropsI {
  onCloseModal: () => void;
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  onClaim: (images: string[], address?: string) => void;
  dontShowAddressOnInput: boolean;
  setDontShowAddressOnInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum ClaimAirspaceSteps {
  UNSELECTED,
  RENT,
  ZONING_PERMISSION,
  UPLOAD_IMAGE,
}

export const ClaimModal = ({
  onCloseModal,
  data,
  setData,
  onClaim,
  dontShowAddressOnInput,
  setDontShowAddressOnInput,
}: PropsI) => {
  const endOfDivRef = useRef(null);
  const { currentStep } = useTour();
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);
  useEffect(() => {
    if (endOfDivRef.current && currentStep === 3) {
      const { scrollHeight, clientHeight } = endOfDivRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      (endOfDivRef.current as any).scrollTop =
        maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, [currentStep]);

  useEffect(() => {
    const airSpaceName = data.address.split(",");

    if (data.title === "") {
      setData((prev) => {
        return {
          ...prev,
          title: airSpaceName[0],
        };
      });
    }
  }, [data.address]);

  const [inputAddress, setInputAddress] = useState("");
  const { isMobile } = useMobile();
  const [currentMode, setCurrentMode] = useState("Claim Airspace");
  const { generatePublicFileUploadUrls } = S3UploadServices();
  const [stepsCounter, setStepCounter] = useState(1);

  const [steps, setSteps] = useState<ClaimAirspaceSteps>(
    ClaimAirspaceSteps.UNSELECTED,
  );
  const isDisabled = data.hasZoningPermission === null;

  const handleClaim = async () => {
    if (selectedFile.length > 0) {
      const imageList: string[] = [];
      const contentTypes = selectedFile.map((file) => file.type);

      const params = await generatePublicFileUploadUrls({
        contentTypes,
        referenceId: data.address,
      });

      if (params) {
        const uploadPromises = params.map(async (param, index) => {
          const imageRes = await uploadImage(
            param?.uploadUrl,
            selectedFile[index],
          );

          if (!imageRes || imageRes?.data?.status !== "SUCCESS") {
            throw new Error("Failed to upload file");
          }
          imageList.push(param.key);
        });
        await Promise.all(uploadPromises);
      }
      await onClaim(imageList, inputAddress);
    } else {
      onClaim([], inputAddress);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleCancelButton = () => {
    if (steps === ClaimAirspaceSteps.UNSELECTED) {
      onCloseModal();
    } else if (steps === ClaimAirspaceSteps.ZONING_PERMISSION) {
      setStepCounter(stepsCounter - 1);
      setSteps(ClaimAirspaceSteps.UNSELECTED);
    } else if (steps === ClaimAirspaceSteps.RENT) {
      setStepCounter(stepsCounter - 1);
      setSteps(ClaimAirspaceSteps.ZONING_PERMISSION);
    } else if (steps === ClaimAirspaceSteps.UPLOAD_IMAGE) {
      setStepCounter(stepsCounter - 1);
      if (data.rent) {
        setSteps(ClaimAirspaceSteps.RENT);
      } else {
        setSteps(ClaimAirspaceSteps.ZONING_PERMISSION);
      }
    } else {
      onCloseModal();
    }
  };

  const handleNextButton = async () => {
    if (steps === ClaimAirspaceSteps.UNSELECTED) {
      setStepCounter(stepsCounter + 1);
      setSteps(ClaimAirspaceSteps.ZONING_PERMISSION);
    } else if (steps === ClaimAirspaceSteps.ZONING_PERMISSION) {
      setStepCounter(stepsCounter + 1);
      if (data.rent) {
        setSteps(ClaimAirspaceSteps.RENT);
      } else {
        setSteps(ClaimAirspaceSteps.UPLOAD_IMAGE);
      }
    } else if (steps === ClaimAirspaceSteps.UPLOAD_IMAGE) {
      try{
        setIsClaimLoading(true)
        await handleClaim();
        setIsClaimLoading(false)
      }finally{
        setIsClaimLoading(false)

      }
    } else if (steps === ClaimAirspaceSteps.RENT) {
      setStepCounter(stepsCounter + 1);
      setSteps(ClaimAirspaceSteps.UPLOAD_IMAGE);
    }
  };

  const isClaimAirspace = steps === ClaimAirspaceSteps.UPLOAD_IMAGE;
  return (
    <div>
      <Backdrop />
      <div className="claim-modal-step fixed left-0 top-1/2 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white md:rounded-[30px] rounded-t-3xl w-full md:w-[689px] max-h-[50dvh] md:max-h-[640px] h-[90%] md:h-auto z-[500] sm:z-[20000000000] flex flex-col gap-[15px] overflow-y-auto overflow-x-hidden">
        <div className=" hidden md:block z-[100] h-[68px] sticky top-0 left-0 right-0 py-[20px] px-[29px] -mt-[1px] md:shadow-none bg-white ">
          <div className="relative flex items-center gap-[20px] md:p-0 ">
            <div className="text-[14px] text-[#0653EA]">
              {stepsCounter}/{data.rent ? "4" : "3"}
            </div>

            <div className="flex justify-center items-center w-[95%] gap-2 ">
              <h2 className="text-[#222222] text-center font-medium text-xl">
                {currentMode}
              </h2>
            </div>

            <div
              onClick={onCloseModal}
              className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
            >
              <CloseIconBlack />
            </div>
          </div>
        </div>
        <div className="mt-3 md:mt-0 overflow-y-scroll">
          {isMobile && (
            <div
              onClick={onCloseModal}
              className="flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <div className="h-2.5 w-16 bg-[#D9D9D9] rounded-full mb-2"></div>
                <h1 className="text-lg font-semibold">Claim Airspace</h1>
              </div>
            </div>
          )}
          <div className="px-[29px] mt-4 md:mt-0">
            {/* The 1st page */}
            {steps === ClaimAirspaceSteps.UNSELECTED && (
              <div>
                <div
                  className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg"
                  style={{ border: "1px solid #4285F4" }}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <LocationPointIcon />
                  </div>
                  {dontShowAddressOnInput ? (
                    <input
                      value={inputAddress}
                      onChange={(e) => {
                        setInputAddress(e.target.value);
                      }}
                      className="text-[14px] outline-none text-[#222222] flex-1"
                      style={{ border: "none" }}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="off"
                      placeholder="Enter address"
                    />
                  ) : (
                    <input
                      value={data?.address}
                      className="text-[14px] outline-none text-[#222222] flex-1"
                      style={{ border: "none" }}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="off"
                      placeholder="Enter address"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-[5px] mt-3 md:mt-4">
                  <label htmlFor="name">
                    Name of air rights<span className="text-[#E04F64]">*</span>
                  </label>

                  <input
                    value={data?.title}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222] mt-0.5 md:mt-1"
                    style={{ border: "1px solid #87878D" }}
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-[5px] mt-3 md:mt-4">
                  <label htmlFor="apn">APN (Assessor Parcel Number)</label>

                  <input
                    value={data?.assessorParcelNumber}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        assessorParcelNumber: e.target.value,
                      }))
                    }
                    className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222] mt-0.5 md:mt-1"
                    style={{ border: "1px solid #87878D" }}
                    type="text"
                    name="apn"
                    id="apn"
                    autoComplete="off"
                  />
                </div>

                <PlanningPermission data={data} setData={setData} />
              </div>
            )}

            {/* The rent page */}
            {steps === ClaimAirspaceSteps.RENT && (
              <RentalDetails data={data} setData={setData} />
            )}

            {/* Available for rent page */}
            {steps === ClaimAirspaceSteps.ZONING_PERMISSION && (
              <ZoningPermission setData={setData} data={data} />
            )}

            {/* The last card  */}
            {steps === ClaimAirspaceSteps.UPLOAD_IMAGE && (
              <AirspacePhotoUpload
                selectedFiles={selectedFile}
                setSelectedFiles={setSelectedFile}
                data={data}
                setData={setData}
              />
            )}

            <div className="  flex items-center md:justify-between gap-[20px] text-[14px]  my-8">
              <div
                onClick={handleCancelButton}
                className="rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer"
                style={{ border: "1px solid #0653EA" }}
              >
                {steps === ClaimAirspaceSteps.UNSELECTED ? "Cancel" : "Back"}
              </div>

              <LoadingButton
                    onClick={handleNextButton}
                    isLoading={isClaimLoading}
                    color="white"
                    className="Claim-airspacebtn2-step w-[75%] md:w-[25%] rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer flex justify-center"
                  >
                  <div className="flex justify-center items-center w-full">
                      {isClaimAirspace ? "Claim Airspace" : "Next"}
                  </div>
              </LoadingButton>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
