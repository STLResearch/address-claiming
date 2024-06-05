import React, { useEffect, useState } from "react";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import RentalDetails from "./RentalDetails/RentalDetails";
import SellingDetails from "./SellingDetails";
import PlanningPermission from "./PlanningPermission/PlanningPermission";
import AirspaceOptions from "./AirspaceOptions/AirspaceOptions";
import AirspaceInfo from "./AirspaceInfo";
import ClaimAirspaceHeader from "./ClaimAirspaceHeader";
import { claimAirspaceProperty } from "@/utils/propertyUtils/propertyUtils";
import PropertiesService from "@/services/PropertiesService";
import { Coordinates,User,PropertyData } from "@/types";
import useAuth from "../../../hooks/useAuth";

interface ClaimModalProps {
  onCloseModal: () => void;
  data: PropertyData;
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
  coordinates:Coordinates | null;
  user:User;
  setShowFailurePopUp: (value: boolean) => void;
  setShowSuccessPopUp: (value: boolean) => void;
  setShowClaimModal: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  defaultData: PropertyData;
  setErrorMessages:React.Dispatch<React.SetStateAction<string[]>>
}

const ClaimModal: React.FC<ClaimModalProps> = ({
  onCloseModal,
  data,
  setData,
  coordinates,
  user,
  setShowFailurePopUp,
  setShowSuccessPopUp,
  setShowClaimModal,
  setIsLoading,
  defaultData,
  setErrorMessages
}) => {
  const { claimProperty } = PropertiesService();
  const [claimButtonLoading, setClaimButtonLoading] = useState<boolean>(false);
  const{redirectIfUnauthenticated}=useAuth()
  useEffect(() => {
    let airSpaceName = data.address.split(",");
    setData((prev) => {
      return {
        ...prev,
        title: airSpaceName[0],
      };
    });
  }, []);
  const onClaim = async () => {
    await claimAirspaceProperty(
      claimProperty,
      data,
      coordinates,
      user,
      setShowFailurePopUp,
      setShowSuccessPopUp,
      setShowClaimModal,
      setIsLoading,
      setData,
      setClaimButtonLoading,
      defaultData,
      redirectIfUnauthenticated,
      setErrorMessages
    );
  };
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white md:rounded-[30px] w-full max-h-screen h-screen md:max-h-[640px] md:h-auto overflow-y-auto overflow-x-auto md:w-[689px] z-[500] sm:z-50 flex flex-col gap-[15px] ">
      <div
        className="z-[100] sticky top-0 left-0 right-0 bg-white py-[20px] px-[29px] -mt-[1px]      md:shadow-none"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <ClaimAirspaceHeader onCloseModal={onCloseModal} />
      </div>
      <div className="md:overflow-y-scroll">
        <div className="px-[29px]">
          <AirspaceInfo
            address={data?.address}
            title={data?.title}
            setData={setData}
          />
          <AirspaceOptions
            isRentableAirspace={data?.isRentableAirspace}
            sell={data?.sell}
            setData={setData}
          />
          {data.isRentableAirspace && (
            <RentalDetails
              hasChargingStation={data?.hasChargingStation}
              hasLandingDeck={data?.hasLandingDeck}
              hasStorageHub={data?.hasStorageHub}
              timezone={data?.timezone}
              transitFee={data?.transitFee}
              weekDayRanges={data?.weekDayRanges}
              setData={setData}
            />
          )}
          {data.sell && (
            <SellingDetails
              sellingPrice={data?.sellingPrice}
              setData={setData}
            />
          )}
          <PlanningPermission isActive={data?.isActive} setData={setData} />

          <div className="  flex items-center md:justify-center gap-[20px] text-[14px]  my-8">
            <div
              onClick={onCloseModal}
              className="rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer"
              style={{ border: "1px solid #0653EA" }}
            >
              Cancel
            </div>

            <div className="w-[75%] md:w-[25%] rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer">
              <div className="flex justify-center items-center w-full ">
                <LoadingButton
                  onClick={onClaim}
                  isLoading={claimButtonLoading}
                  color={"white"}
                  className=""
                >
                  Claim Airspace
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClaimModal;
