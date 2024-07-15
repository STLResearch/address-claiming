import { CloseIcon, InfoIcon, LocationPointIcon } from "@/Components/Icons";
import useAuth from "@/hooks/useAuth";
import { Web3authContext } from "@/providers/web3authProvider";
import AirspaceRentalService from "@/services/AirspaceRentalService";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import SuccessModal from "../SuccessModal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { VersionedTransaction } from "@solana/web3.js";
import { getTokenBalance } from "@/utils/apiUtils/apiFunctions";
import { validateRental } from "@/utils/rent/rentalValidation";
import { handleMintResponse } from "@/utils/rent/mintResponseHandler";
import { executeTransaction } from "@/utils/rent/transactionExecutor";
import { handleExecuteResponse } from "@/utils/rent/executeResponseHandler";
import { PropertyData } from "@/types";
import { toast } from "react-toastify";
import Backdrop from "@/Components/Backdrop";
import { removePubLicUserDetailsFromLocalStorageOnClose } from "@/helpers/localstorage";
import { useMobile } from "@/hooks/useMobile";
import { TextField, Box } from "@mui/material";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import { getMapboxStaticImage } from "@/utils";
import { ArrowLeftIcon } from "@/Components/Icons";

interface RentPreviewProps {
  setShowRentPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
  rentData: PropertyData | null | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}
const RentPreview: React.FC<RentPreviewProps> = ({
  setShowRentPreview,
  setShowClaimModal,
  rentData,
  setIsLoading,
  isLoading,
}) => {
  const defaultValueDate = dayjs()
    .add(1, "h")
    .set("minute", 30)
    .startOf("minute");
  const maxDate = dayjs().add(29, "day");
  const [landAssetIds, setLandAssetIds] = useState([]);
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [date, setDate] = useState(defaultValueDate);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { isMobile } = useMobile();
  const [finalAns, setFinalAns] = useState<
    | { status: string; message?: string | undefined; tokenId?: string }
    | null
    | undefined
  >();
  const { user, redirectIfUnauthenticated, setAndClearOtherPublicRouteData } =
    useAuth();
  const { createMintRentalToken, executeMintRentalToken } =
    AirspaceRentalService();
  const { provider } = useContext(Web3authContext);

  localStorage.setItem("rentData", JSON.stringify(rentData));

  useEffect(() => {
    if (user) {
      getTokenBalance(user, setTokenBalance);
    }
  }, [user]);

  // const handleRentAirspace = async () => {
  //   try {
  //     const isRedirecting = redirectIfUnauthenticated();
  //     if (isRedirecting) {
  //       setAndClearOtherPublicRouteData("rentData", rentData);
  //       return;
  //     }
  //     const currentDate = new Date();
  //     const startDate = new Date(date.toString());
  //     const endDate = new Date(startDate.getTime() + 30 * 60000);

  //     if (
  //       !validateRental(
  //         currentDate,
  //         startDate,
  //         endDate,
  //         tokenBalance,
  //         setFinalAns,
  //         setShowSuccess
  //       )
  //     )
  //       return;

  //     setIsLoading(true);
  //     if (rentData?.layers) {
  //       const postData = {
  //         callerAddress: user?.blockchainAddress,
  //         startTime: startDate.toISOString(),
  //         endTime: endDate.toISOString(),
  //         landAssetIds: [rentData.layers[0].tokenId],
  //       };

  //       const createMintResponse = await createMintRentalToken({ postData });
  //       const mintResponse = await handleMintResponse(
  //         createMintResponse,
  //         setIsLoading,
  //         setShowSuccess,
  //         setFinalAns
  //       );
  //       if (!mintResponse) return;
  //       const transaction = VersionedTransaction.deserialize(
  //         new Uint8Array(Buffer.from(createMintResponse, "base64"))
  //       );
  //       const txString = await executeTransaction(transaction, provider);
  //       if (!txString) return;

  //       const postExecuteMintData = {
  //         transaction: txString,
  //         landAssetIds: [rentData?.layers[0].tokenId],
  //         startTime: startDate.toISOString(),
  //         endTime: endDate.toISOString(),
  //       };

  //       const executionResponse = await executeMintRentalToken({
  //         postData: { ...postExecuteMintData },
  //       });

  //       handleExecuteResponse(executionResponse, setFinalAns, setShowSuccess);
  //     } else {
  //       toast.error("something went wrong!");
  //     }
  //   } catch (error) {
  //     setFinalAns({ status: "Rent failed", message: error.message });
  //   } finally {
  //     setIsLoading(false);
  //     localStorage.removeItem("rentData");
  //   }
  // };

  const handleShowRentPreview = () => {};

  if (showSuccess) {
    return (
      <SuccessModal
        setShowSuccess={setShowSuccess}
        finalAns={finalAns}
        rentData={rentData}
        setShowClaimModal={setShowClaimModal}
      />
    );
  }
  const shouldDisableTime = (value, view) => {
    if (view === "minutes" && value.minute() >= 1 && value.minute() <= 29) {
      return true;
    } else if (
      view === "minutes" &&
      value.minute() >= 31 &&
      value.minute() <= 59
    ) {
      return true;
    } else {
      return false;
    }
  };

  const imageUrl = getMapboxStaticImage(
    rentData?.latitude,
    rentData?.longitude
  );
  console.log(rentData, "the rent data");

  return (
    <div>
      {!isMobile && <Backdrop />}
      <div
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926", zIndex: 100 }}
        className="touch-manipulation fixed sm:left-1/2 md:top-1/2  md:-translate-x-1/2 md:-translate-y-1/2 bg-white py-[30px] md:rounded-[30px] px-[29px] w-full max-h-screen h-screen md:max-h-[700px] md:h-auto md:w-[689px] z-[100] md:z-40 flex flex-col gap-[15px]"
      >
        <div
          className=" touch-manipulation relative flex items-center gap-[20px] md:p-0 py-[20px] px-[29px] -mx-[29px] -mt-[30px] md:my-0 md:mx-0 md:shadow-none"
          //   style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
        >
          <div
            className="w-[16px] h-[12px] cursor-pointer "
            onClick={() => {
              //   removePubLicUserDetailsFromLocalStorageOnClose("rentData");
              setShowRentPreview(false);
              setShowClaimModal(true);
            }}
          >
            <ArrowLeftIcon />
          </div>
          <div className="flex items-center w-full justify-center">
            <h2 className="text-[#222222] font-medium text-xl leading-[30px] text-center">
              Rental Preview
            </h2>
          </div>
          <div
            onClick={() => {
              setShowRentPreview(false);
              removePubLicUserDetailsFromLocalStorageOnClose("rentData");
            }}
            className="hidden md:block absolute top-0 right-0 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIcon />
          </div>
        </div>
        <div className="touch-manipulation flex items-center gap-[10px] p-[11px] rounded-lg border border-[#4285F4]">
          <div className="w-6 h-full flex items-center">
            <LocationPointIcon />
          </div>
          <p className="flex items-center font-normal text-[#222222] text-[14px] flex-1">
            {rentData ? rentData.address : ""}
          </p>
        </div>
        <div>
          <div className="relative w-full h-[130px]">
            <Image
              src={imageUrl}
              alt={`Map at ${rentData?.latitude}, ${rentData?.longitude}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        {/* <div className="flex touch-manipulation items-center justify-evenly gap-[20px] text-[14px]">
          <div className="flex touch-manipulation flex-col gap-[5px] w-full">
            <label htmlFor="rentalDate">
              Rental Date and Time
              <span className="text-[#E04F64] touch-manipulation">*</span>
            </label>
            <DateTimePicker
              value={date}
              onChange={(e) => {
                setDate(e);
              }}
              disablePast
              maxDate={maxDate}
              shouldDisableTime={shouldDisableTime}
              slotProps={{
                popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-10, -30],
                    },
                  },
                  {
                    name: 'preventOverflow',
                    options: {
                      altAxis: true, 
                    },
                  },
                ],
              }
              }}
            />
          </div>
        </div> */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-[15px] text-[14px] text-light-black leading-[21px]">
            <div className="flex ">
              <div>Owner:</div>
              <div className="text-light-grey pl-[15px]">
                {rentData?.owner?.name}
              </div>
            </div>
            <div className="flex">
              <div>ID::</div>
              <div className="text-light-grey pl-[15px]">{rentData?.id}</div>
            </div>
            <div className="flex">
              <div>Fees:</div>
              <div className="text-light-grey pl-[15px]">
                {rentData?.transitFee}
              </div>
            </div>
          </div>
        </div>
            <hr className="mb-[15px]"/>

        <div className="touch-manipulation flex items-center justify-between gap-[20px] text-[14px]">
          {/* <div
            onClick={() => {
              setShowClaimModal(false);
              removePubLicUserDetailsFromLocalStorageOnClose("rentData");
            }}
            className="text-center touch-manipulation rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer w-1/2"
            style={{ border: "1px solid #0653EA" }}
          >
            Cancel
          </div> */}
          <div className="flex justify-center">
            <div className="text-light-black pr-[10px]">
              <div className="font-bold text-2xl leading-9">
                &#36;{rentData?.price}
              </div>
            </div>
            <div className="border-l-2 border-[#000] border-opacity-20 pr-[10px]" />

            <div>
              <p className="text-[11px] text-light-dark leading-[16.5px] ">
                10 january 2024
              </p>
              <p className="text-[11px] text-light-dark leading-[16.5px]">
                9:00 - 09:30
              </p>
            </div>
          </div>
          <LoadingButton
            // onClick={handleRentAirspace}
            isLoading={isLoading}
            className="flex justify-center items-center text-center touch-manipulation rounded-[5px] py-[10px] px-[22px] text-white bg-[#0653EA] cursor-pointer w-1/2"
          >
            Confirm Rental now
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};
export default RentPreview;
