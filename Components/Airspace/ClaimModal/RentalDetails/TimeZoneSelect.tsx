import React, { Fragment, useState } from "react";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { defaultData } from "../../../../types";
import { DropDownIcon } from "@/Components/Icons";

interface PropsI {
  setTimeZone: (timeZone: string) => void;
  data: defaultData;
}

const TimeZoneSelect = ({ data, setTimeZone }: PropsI) => {
  const labelStyle = "original";
  const timezones = {
    ...allTimezones,
    "Europe/Berlin": "Frankfurt",
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const selectedLabel = data.timezone || "UTC-1";
  const handleTimeZoneChange = (event) => {
    const selectedTimeZone = event.target.value;
    setTimeZone(selectedTimeZone);
  };

  return (
    <Fragment>
      <label
        htmlFor="timeZone"
        className="text-[14px] font-normal text-[#838187] leading-[2rem] md:leading-none"
      >
        Time Zone<span className="text-[#E04F64]">*</span>
      </label>
      <div className="relative w-full">
        <select
          value={selectedLabel}
          onChange={handleTimeZoneChange}
          name="timeZone"
          id="timeZone"
          className="w-full appearance-none rounded-lg !pl-[22px] !pr-[42px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none"
          style={{ border: "1px solid #87878D" }}
        >
          <option value="UTC-1">UTC-1</option>
          {options.map((geographicTimeZone) => (
            <option
              key={geographicTimeZone.value}
              value={geographicTimeZone.value}
            >
              {`${geographicTimeZone.label} ${geographicTimeZone.value}`}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-[22px] flex items-center pointer-events-none">
          <DropDownIcon />
        </div>
      </div>
    </Fragment>
  );
};

export default TimeZoneSelect;
