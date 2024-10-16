import React, { Fragment } from "react";
import Link from "next/link";
import VariableFeeRentalRangesSelect from "./VariableFeeRentalRangesSelect";
import TimeZoneSelect from "./TimeZoneSelect";
import WeekDayRangesForm from "./WeekDayRangesForm";
import FacilityFeaturesSelect from "./FacilityFeaturesSelect";
import { defaultData, WeekDayRange } from "@/types";
interface RentalDetailsProps {
  transitFee: string;
  data: defaultData;
  weekDayRanges: WeekDayRange[];
  hasLandingDeck: boolean;
  hasChargingStation: boolean;
  hasStorageHub: boolean;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const RentalDetails: React.FC<RentalDetailsProps> = ({
  transitFee,
  data,
  weekDayRanges,
  hasLandingDeck,
  hasChargingStation,
  hasStorageHub,
  setData,
}) => {
  return (
    <Fragment>
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
      <div className="md:flex items-center justify-between gap-[15px] mt-4">
        <div className="flex-1">
          <VariableFeeRentalRangesSelect
            fee={transitFee}
            setFee={(fee) =>
              setData((prev) => ({ ...prev, transitFee: "" + fee }))
            }
          />
        </div>
        <div className="flex-1 mt-4 md:mt-0">
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
          <span className="text-[#E04F64]">*</span>
        </p>
        <FacilityFeaturesSelect
          hasLandingDeck={hasLandingDeck}
          hasChargingStation={hasChargingStation}
          hasStorageHub={hasStorageHub}
          setData={setData}
        />
      </div>
      <div className="flex flex-col gap-[15px] mt-2">
        <p>
          Availability<span className="text-[#E04F64]">*</span>
        </p>
        <WeekDayRangesForm
          weekDayRanges={weekDayRanges}
          setWeekDayRanges={(weekDayRanges) =>
            setData((prev) => ({ ...prev, weekDayRanges }))
          }
        />
      </div>
    </Fragment>
  );
};

export default RentalDetails;
