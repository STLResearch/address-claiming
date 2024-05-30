import React, { useState } from "react";
import { RectangleIcon,LocationPointIcon } from "@/Components/Icons";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";
import { PropertyData } from "@/types";
import { Dayjs } from "dayjs";
interface MobileRentModalProps {
  rentData: PropertyData | null | undefined;
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  maxDate: Dayjs;
  shouldDisableTime:  (value: Dayjs, view: string) => boolean;
  handleRentAirspace: () => void;
  setShowClaimModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const MobileRentModal: React.FC<MobileRentModalProps> = ({
  rentData,
  date,
  setDate,
  maxDate,
  shouldDisableTime,
  handleRentAirspace,
  setShowClaimModal,
}) => {
  const [showRentalPreview, setShowRentalPreview] = useState(false);
  const formattedDate = date.format("D MMMM YYYY");
  const startTime = date.format("H:mm");
  const endTime = date.add(30, "minute").format("H:mm");
  return (
    <div className="z-[60] fixed bottom-0 mt-4 md:ml-12  bg-white  md:bg-[#FFFFFFCC] no-scrollbar rounded-[30px] w-full md:max-w-sm  md:max-h-[600px] max-w-[600px]  md:py-[12px] md:rounded-[30px]  mx-auto overflow-x-auto  flex flex-col sm:hidden gap-[15px]  md:pb-0 ">
      <div className="px-[25px] ">
        <div className=" flex flex-col justify-end items-center mt-4 md:mt-0 ">
          <div className=" w-[90%] flex justify-center  items-center">
            <RectangleIcon />
          </div>
          <div className="flex items-center w-full justify-center">
            <h2 className="text-[#222222] font-medium text-xl text-center mt-[21px]">
              {showRentalPreview ? "Rental Preview" : "Airspace Details"}
            </h2>
          </div>
        </div>
        <div
          className="touch-manipulation flex items-center gap-[10px] py-4 px-[22px] mt-[15px] rounded-lg"
          style={{ border: "1px solid #4285F4" }}
        >
          <div className="w-6 h-6">
            <LocationPointIcon />
          </div>
          <p className="font-normal text-[#222222] text-[14px] flex-1">
            {rentData ? rentData.address : ""}
          </p>
        </div>
        <div className="flex flex-col gap-y-[15px] mt-[15px] text-[14px] text-light-black leading-[21px]">
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
        {!showRentalPreview && (
          <div>
            <div className="flex touch-manipulation items-center justify-evenly gap-[20px] text-[14px] mt-[30px]">
              <div className="flex touch-manipulation flex-col gap-[5px] w-full text-light-grey">
                <label htmlFor="rentalDate">
                  Rental Date
                  <span className="text-[#E04F64] touch-manipulation">*</span>
                </label>
                <DatePicker
                  value={date}
                  onChange={(d) => setDate(d)}
                  disablePast
                  maxDate={maxDate}
                />
                <label htmlFor="rentalDate">
                  Starting Time
                  <span
                    className="text-[#E04F64] touch-manipulati<MobileAirspaceAvailabilityBar totalAirspaceAvailable={3} onActivate={handleShowDetailFullMobile}/>
              <RentAirspaceLists
                registeredAddress={registeredAddress}
                marker={marker}
                map={map}
                setMarker={setMarker}
                showClaimModal={showClaimModal}
                setShowClaimModal={setShowClaimModal}
                setRentData={setRentData}
                user1={user}
              />on"
                  >
                    *
                  </span>
                </label>
                <TimePicker
                  value={date}
                  shouldDisableTime={shouldDisableTime}
                  onChange={(d) => setDate(d)}
                />
              </div>
            </div>
            <div className="text-light-black mt-[30px]">
              <div className="text-[14px] leading-[21px] ">Current Price</div>
              <div className="font-bold text-2xl leading-9">
                &#36; {rentData?.price}
              </div>
            </div>
          </div>
        )}
      </div>
      {!showRentalPreview ? (
        <div className="py-[10px] px-[29px] shadow-[0_0px_4.2px_0px_rgba(0,0,0,0.25)] touch-manipulation flex items-center justify-center gap-[20px] text-[14px]">
          <div
            onClick={() => {
              setShowClaimModal(false);
            }}
            className="touch-manipulation rounded-[5px] py-[10px] px-[22px] text-[#0653EA] cursor-pointer w-1/2"
          >
            Cancel
          </div>
          <div
            onClick={() => {
              setShowRentalPreview(true);
            }}
            className="touch-manipulation rounded-[5px] py-[10px] text-white bg-[#0653EA] cursor-pointer w-1/2 flex justify-center"
          >
            Rent Now
          </div>
        </div>
      ) : (
        <div className="flex px-[29px] justify-evenly items-center py-[10px]  shadow-[0_0px_4.2px_0px_rgba(0,0,0,0.25)] touch-manipulation gap-[20px] text-[14px]">
          <div className="font-bold text-2xl leading-9">
            &#36; {rentData?.price}
          </div>
          <div className="h-9 w-px bg-black"></div>
          <div>
            <div>{formattedDate}</div>
            <div className="flex">
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>
          <div
            onClick={handleRentAirspace}
            className="rounded-[5px] py-[10px] px-[10px] text-white bg-[#0653EA] cursor-pointer flex justify-center"
          >
            Confirm Rental
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileRentModal;
