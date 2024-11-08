import {  CloseIconBlack, LocationPointIcon } from "@/Components/Icons";
import useAuth from "@/hooks/useAuth";
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import SuccessModal from "../SuccessModal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getTokenBalance } from "@/utils/apiUtils/apiFunctions";
import { PropertyData } from "@/types";
import Backdrop from "@/Components/Backdrop";
import { removePubLicUserDetailsFromLocalStorageOnClose } from "@/helpers/localstorage";
import { useMobile } from "@/hooks/useMobile";
import LoadingButton from "@/Components/LoadingButton/LoadingButton";
import PropertiesService from "@/services/PropertiesService";
import Carousel from "@/Components/Shared/Carousel";
import { getMapboxStaticImage } from "@/utils/getMapboxStaticImage";

interface RentDetailProps {
  setShowRentDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setShowRentPreview: React.Dispatch<React.SetStateAction<boolean>>;
  rentData: PropertyData | null | undefined;
  isLoading: boolean;
  date:any;
  setDate:any;
}
const RentDetail: React.FC<RentDetailProps> = ({
  setShowRentPreview,
  setShowRentDetail,
  rentData,
  isLoading,
  date,
  setDate
}) => {
  const maxDate = dayjs().add(29, "day");
  const [tokenBalance, setTokenBalance] = useState<string>("0");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { isMobile } = useMobile();
  const [finalAns, setFinalAns] = useState<
    { status: string; message?: string | undefined } | null | undefined
  >();
  const {
    user,
    web3authStatus,
  } = useAuth();
  const { getRentedTimes } = PropertiesService();
  localStorage.setItem("rentData", JSON.stringify(rentData));
  const rentedTimes = useRef([]);

  useEffect(() => {
    if (user) {
      getTokenBalance(user, setTokenBalance);
    }
  }, [user]);

  const fetchAndSetRentedTimes = async () => {
    const rentedData = await getRentedTimes(rentData?.id as string);
    const checkStartTimes = rentedData?.map((item) => item.startTime);
    rentedTimes.current = checkStartTimes || [];
  };

  useEffect(() => {
    if (rentData?.id && web3authStatus) {
      fetchAndSetRentedTimes();
    }
  }, [rentData, web3authStatus]);

  if (showSuccess) {
    return (
      <SuccessModal
        setShowSuccess={setShowSuccess}
        finalAns={finalAns}
        rentData={rentData}
        setShowRentDetail={setShowRentDetail}
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
    }

    const time = value.toDate().getTime();
    const isTimeRented = rentedTimes.current.some((rentedTime) => {
      const rentedStart = new Date(rentedTime).getTime();
      return time === rentedStart;
    });
    return isTimeRented;
  };

  const handleShowRentPreview = () => {
    setShowRentDetail(false);
    setShowRentPreview(true);
  };
  const images = rentData?.images || [];
  let displayImages;
  if(rentData){
    const imageUrl = getMapboxStaticImage(rentData.latitude, rentData.longitude);
    if(rentData?.orderPhotoforGeneratedMap){
      displayImages = [...(images || []), imageUrl];
    }
    else{
      displayImages = [imageUrl, ...(images || [])];
    }
    
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {!isMobile && (
        <Backdrop
          onClick={() => {
            setShowRentDetail(false);
          }}
        />
      )}
      <div
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926", zIndex: 100 }}
        className="touch-manipulation border fixed bottom-[74px] left-0 px-[29px] sm:top-1/2  sm:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white pt-[30px] pb-[10px] sm:py-[30px] gap-[15px] rounded-t-[30px] md:rounded-[30px]  w-full h-[400px] sm:h-[480px] md:w-[689px] z-[100] md:z-40 flex flex-col  overflow-auto sm:overflow-hidden"
      >
        <div className="flex flex-col gap-[15px]">
          <div 
            onClick={() => {
              removePubLicUserDetailsFromLocalStorageOnClose("rentData");
              setShowRentDetail(false);
            }}
          className="flex flex-col items-center justify-center gap-4 sm:hidden">
            <div className="w-16 animate-pulse h-2 rounded-3xl bg-light-grey"></div>
          </div>
          <div className="flex items-center w-full justify-center">
            <h2 className="text-[#222222] font-medium text-xl text-center">
            Air Rights Details
            </h2>
          </div>
          <div
            onClick={() => {
              setShowRentDetail(false);
              removePubLicUserDetailsFromLocalStorageOnClose("rentData");
            }}
            className="hidden sm:block absolute top-7 right-7 w-[15px] h-[15px] ml-auto cursor-pointer"
          >
            <CloseIconBlack />
          </div>
        </div>
        <div
          className="touch-manipulation flex items-center gap-[10px] py-4 px-[22px] rounded-lg"
          style={{ border: "1px solid #4285F4" }}
        >
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {rentData ? rentData.address : ""}
          </p>
        </div>
        <div>

        <div className="relative w-full !h-[130px]">
        <Carousel images={displayImages} />
      </div>
      </div>
        <div className="flex touch-manipulation items-center justify-evenly gap-[20px] text-[14px]">
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
                      name: "offset",
                      options: {
                        offset: [-10, -30],
                      },
                    },
                    {
                      name: "preventOverflow",
                      options: {
                        altAxis: true,
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        </div>

        <div className="touch-manipulation flex items-center justify-center gap-[20px] text-[14px]">
          <div
            onClick={() => {
              setShowRentDetail(false);
              removePubLicUserDetailsFromLocalStorageOnClose("rentData");
            }}
            className="text-center touch-manipulation rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer w-1/2"
            style={{ border: "1px solid #0653EA" }}
          >
            Cancel
          </div>
          <LoadingButton
            onClick={handleShowRentPreview}
            isLoading={isLoading}
            className="flex justify-center items-center text-center touch-manipulation rounded-[5px] py-[10px] text-white bg-[#0653EA] cursor-pointer w-1/2"
          >
            Rent Air Rights
          </LoadingButton>
        </div>
      </div>
    </LocalizationProvider>
  );
};
export default RentDetail;
