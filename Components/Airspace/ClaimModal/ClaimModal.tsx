import React, { Fragment, useEffect, useState, useRef } from "react";
import LoadingButton from "../../../Components/LoadingButton/LoadingButton";
import useAuth from "../../../hooks/useAuth";
import { ArrowLeftIcon, CloseIconBlack, InfoIcon, LocationPointIcon, DropDownIcon } from "../../../Components/Icons";
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
  setAddress: React.Dispatch<React.SetStateAction<string>>;
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
  setAddress,
}: PropsI) => {
  const endOfDivRef = useRef(null);
  const { currentStep } = useTour();
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState<boolean>(false);
  const [byteSizeError, setByteSizeError] = useState(false);
  useEffect(() => {
    if (endOfDivRef.current && currentStep === 3) {
      const { scrollHeight, clientHeight } = endOfDivRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      (endOfDivRef.current as any).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
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

  const { isMobile } = useMobile();
  const [currentMode, setCurrentMode] = useState("Claim Air Rights");
  const { generatePublicFileUploadUrls } = S3UploadServices();
  const [stepsCounter, setStepCounter] = useState(1);

  const [steps, setSteps] = useState<ClaimAirspaceSteps>(ClaimAirspaceSteps.UNSELECTED);
  const isDisabled = data.hasZoningPermission === null;

  const handleClaim = async () => {
    try {
      const imageList: string[] = [];
      if (selectedFile.length > 0) {
        const contentTypes = selectedFile.map((file) => file.type);

        const params = await generatePublicFileUploadUrls({
          contentTypes,
          referenceId: data.address,
        });

        if (params) {
          const uploadPromises = params.map(async (param, index) => {
            const imageRes = await uploadImage(param?.uploadUrl, selectedFile[index]);

            if (!imageRes || imageRes?.data?.status !== "SUCCESS") {
              throw new Error("Failed to upload file");
            }
            imageList.push(param.key);
          });
          await Promise.all(uploadPromises);
          await onClaim(imageList);
        }
      } else {
        onClaim([]);
      }
    } catch (error) {
      console.error(error);
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
      setCurrentMode("Claim Air Rights");
    } else if (steps === ClaimAirspaceSteps.RENT) {
      setStepCounter(stepsCounter - 1);
      setSteps(ClaimAirspaceSteps.ZONING_PERMISSION);
      setCurrentMode("Air Rights Settings");
    } else if (steps === ClaimAirspaceSteps.UPLOAD_IMAGE) {
      setStepCounter(stepsCounter - 1);
      if (data.rent) {
        setSteps(ClaimAirspaceSteps.RENT);
        setCurrentMode("Air Rights Renting Settings");
      } else {
        setSteps(ClaimAirspaceSteps.ZONING_PERMISSION);
        setCurrentMode("Air Rights Settings");
      }
    } else {
      onCloseModal();
    }
  };

const handleNextButton = async () => {
  if (steps === ClaimAirspaceSteps.UNSELECTED) {
    const byteSize = getByteSize(data?.title);
    if(byteSize >= 32){
      toast.error('Name of air right exceeds the character limit. Please use a shorter name!');
      return;
    }
    setStepCounter(stepsCounter + 1);
    setSteps(ClaimAirspaceSteps.ZONING_PERMISSION);
    setCurrentMode("Air Rights Settings");  
  } else if (steps === ClaimAirspaceSteps.ZONING_PERMISSION) {
    setStepCounter(stepsCounter + 1);
    if (data.rent) {
      setSteps(ClaimAirspaceSteps.RENT);
      setCurrentMode("Air Rights Renting Settings"); 
    } else {
      setSteps(ClaimAirspaceSteps.UPLOAD_IMAGE);
      setCurrentMode("Air Rights Photos");
    }
  } else if (steps === ClaimAirspaceSteps.UPLOAD_IMAGE) {
    try{
      if (selectedFile.length > 5) {
        toast.error(
          "You can only upload up to 5 files. Please adjust your selection and try again!",
        );
        return;
      }
      setIsClaimLoading(true)
      await handleClaim();
      setIsClaimLoading(false)
    }finally{
      setIsClaimLoading(false);
    }
  } else if (steps === ClaimAirspaceSteps.RENT) {
    setStepCounter(stepsCounter + 1);
    setSteps(ClaimAirspaceSteps.UPLOAD_IMAGE);
    setCurrentMode("Air Rights Photos");
  }
};

const getByteSize = (str) => new Blob([str]).size;
const handleChangeAirRightName = (e) =>{
  const value = e.target.value;
    setData((prev) => ({ ...prev, title: value }))
}
  const isClaimAirspace = steps === ClaimAirspaceSteps.UPLOAD_IMAGE;
  return (
    <div>
      <Backdrop />
      <div className="claim-modal-step fixed left-0 top-1/2 z-[500] flex h-[90%] max-h-[50dvh] w-full flex-col gap-[15px] overflow-y-auto overflow-x-hidden rounded-t-3xl bg-white sm:z-[20000000000] md:left-1/2 md:top-1/2 md:h-auto md:max-h-[640px] md:w-[689px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[30px]">
        <div className="sticky left-0 right-0 top-0 z-[100] -mt-[1px] hidden h-[68px] bg-white px-[29px] py-[20px] md:block md:shadow-none">
          <div className="relative flex items-center gap-[20px] md:p-0">
            <div className="text-[14px] text-[#0653EA]">
              {stepsCounter}/{data.rent ? "4" : "3"}
            </div>

            <div className="flex w-[95%] items-center justify-center gap-2">
              <h2 className="text-center text-xl font-medium text-[#222222]">{currentMode}</h2>
            </div>

            <div
              onClick={onCloseModal}
              className="absolute right-0 top-0 ml-auto hidden h-[15px] w-[15px] cursor-pointer md:block"
            >
              <CloseIconBlack />
            </div>
          </div>
        </div>
        <div className="mt-3 overflow-y-scroll md:mt-0">
          {isMobile && (
            <div onClick={onCloseModal} className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="mb-2 h-2.5 w-16 rounded-full bg-[#D9D9D9]"></div>
                <h1 className="text-lg font-semibold">Claim Air Rights</h1>
              </div>
            </div>
          )}
          <div className="mt-4 px-[29px] md:mt-0">
            {steps === ClaimAirspaceSteps.UNSELECTED && (
              <div>
                <div
                  className="flex items-center gap-[10px] rounded-lg px-[22px] py-4"
                  style={{ border: "1px solid #4285F4" }}
                >
                  <div className="flex h-6 w-6 items-center justify-center">
                    <LocationPointIcon />
                  </div>
                  {dontShowAddressOnInput ?
                    <input
                      value={data?.address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      className="flex-1 text-[14px] text-[#222222] outline-none"
                      style={{ border: "none" }}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="off"
                      placeholder="Enter address"
                    />
                  : <input
                      value={data?.address}
                      className="flex-1 text-[14px] text-[#222222] outline-none"
                      style={{ border: "none" }}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="off"
                      placeholder="Enter address"
                    />
                  }
                </div>
                <div className="mt-3 flex flex-col gap-[5px] md:mt-4">
                  <label htmlFor="name">
                    Name of air rights<span className="text-[#E04F64]">*</span>
                  </label>

                  <input
                    value={data?.title}
                    onChange={
                      handleChangeAirRightName
                    }
                    className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222] mt-0.5 md:mt-1"
                    style={{ border: "1px solid #87878D" }}
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                  />
                </div>
                <div className="mt-3 flex flex-col gap-[5px] md:mt-4">
                  <label htmlFor="apn">APN (Assessor Parcel Number)</label>

                  <input
                    value={data?.assessorParcelNumber}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        assessorParcelNumber: e.target.value,
                      }))
                    }
                    className="mt-0.5 rounded-lg px-[22px] py-[16px] text-[14px] text-[#222222] outline-none md:mt-1"
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

            {steps === ClaimAirspaceSteps.RENT && <RentalDetails data={data} setData={setData} />}

            {steps === ClaimAirspaceSteps.ZONING_PERMISSION && <ZoningPermission setData={setData} data={data} />}

            {steps === ClaimAirspaceSteps.UPLOAD_IMAGE && (
              <AirspacePhotoUpload
                selectedFiles={selectedFile}
                setSelectedFiles={setSelectedFile}
                data={data}
                setData={setData}
              />
            )}

            <div className="my-8 flex items-center gap-[20px] text-[14px] md:justify-between">
              <div
                onClick={handleCancelButton}
                className="cursor-pointer rounded-[5px] px-[22px] py-[10px] text-[#0653EA]"
                style={{ border: "1px solid #0653EA" }}
              >
                {steps === ClaimAirspaceSteps.UNSELECTED ? "Cancel" : "Back"}
              </div>

              <LoadingButton
                onClick={handleNextButton}
                isLoading={isClaimLoading}
                color="white"
                className="Claim-airspacebtn2-step flex w-[75%] cursor-pointer justify-center rounded-[5px] bg-[#0653EA] px-[22px] py-[10px] text-white md:w-[25%]"
              >
                <div className="flex w-full items-center justify-center">
                  {isClaimAirspace ? "Claim Air right" : "Next"}
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
