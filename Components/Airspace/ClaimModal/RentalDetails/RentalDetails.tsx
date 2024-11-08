import React from "react";
import Link from "next/link";
import VariableFeeRentalRangesSelect from "./VariableFeeRentalRangesSelect";
import { DropDownIcon } from "@/Components/Icons";
import TimeZoneSelect from "./TimeZoneSelect";
import WeekDayRangesForm from "./WeekDayRangesForm";

const RentalDetails = ({ data, setData }) => {
  const [isWeekDayFormVisible, setIsWeekDayFormVisible] = React.useState(false);

  const toggleWeekDayForm = () => {
    setIsWeekDayFormVisible((prev) => !prev);
  };

  return (
    <div className="">
      <h2 className="text-[#222222] font-normal text-[20px] leading-[3rem]">
        Rental Details
      </h2>
      <Link
        target="_blank"
        href={"https://skytrade.tawk.help"}
        className="text-[#0653EA] text-[14px] font-normal cursor-pointer leading-[1.5rem]"
      >
        Learn more about rentals in our FAQ.
      </Link>
      <div className="md:flex items-center justify-between gap-4 mt-4">
        <div className="flex-1">
          <VariableFeeRentalRangesSelect
            fee={data?.transitFee}
            setFee={(fee) =>
              setData((prev) => ({ ...prev, transitFee: "" + fee }))
            }
          />
        </div>
        <div className="flex-1 mt-4 md:mt-2">
          <TimeZoneSelect
            setTimeZone={(timezone) =>
              setData((prev) => ({ ...prev, timezone }))
            }
            data={data}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <p className="text-[14px] font-normal text-[#838187] mt-4">
          Select extra features your facility provides
        </p>
        <div className="flex-col flex md:flex-row md:items-center gap-6 leading-[2rem]">
          <div className="flex items-center gap-[5px]">
            <input
              className="w-[18px] h-[18px] cursor-pointer"
              type="checkbox"
              id="hasLandingDeck"
              name="hasLandingDeck"
              checked={data?.hasLandingDeck}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  hasLandingDeck: !prev.hasLandingDeck,
                }))
              }
            />
            <label
              htmlFor="hasLandingDeck"
              className="text-[#87878D] text-[14px] font-normal"
            >
              Landing Deck
            </label>
          </div>
          <div className="flex items-center gap-[5px] mt-1">
            <input
              className="w-[18px] h-[18px] cursor-pointer"
              type="checkbox"
              id="hasChargingStation"
              name="hasChargingStation"
              checked={data?.hasChargingStation}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  hasChargingStation: !prev.hasChargingStation,
                }))
              }
            />
            <label
              htmlFor="hasChargingStation"
              className="text-[#87878D] text-[14px] font-normal"
            >
              Charging Station
            </label>
          </div>
          <div className="flex items-center gap-[5px] mt-1">
            <input
              className="w-[18px] h-[18px] cursor-pointer"
              type="checkbox"
              id="hasStorageHub"
              name="hasStorageHub"
              checked={data?.hasStorageHub}
              onChange={() =>
                setData((prev) => ({
                  ...prev,
                  hasStorageHub: !prev.hasStorageHub,
                }))
              }
            />
            <label
              htmlFor="hasStorageHub"
              className="text-[#87878D] text-[14px] font-normal"
            >
              Storage Hub
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[15px] my-4">
        <div className="flex items-center justify-between">
          <p>Availability</p>
          <div onClick={toggleWeekDayForm} className="cursor-pointer">
            <DropDownIcon />
          </div>
        </div>
        {isWeekDayFormVisible && (
          <WeekDayRangesForm
            weekDayRanges={data?.weekDayRanges}
            setWeekDayRanges={(weekDayRanges) =>
              setData((prev) => ({ ...prev, weekDayRanges }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default RentalDetails;
