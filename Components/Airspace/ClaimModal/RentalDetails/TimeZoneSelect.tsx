import React, { Fragment, useState } from "react";
import {
  useTimezoneSelect,
  allTimezones,
  ITimezoneOption,
} from "react-timezone-select";

interface TimeZoneSelectProps {
  timeZone: string;
  setTimeZone: (timeZone: string) => void;
}

const TimeZoneSelect: React.FC<TimeZoneSelectProps> = ({
  timeZone,
  setTimeZone,
}) => {
  const labelStyle = "original";
  const timezones: { [key: string]: string } = {
    ...allTimezones,
    "Europe/Berlin": "Frankfurt",
  };

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const [selectedLabel, setSelectedLabel] = useState("Europe/London");
  const handleTimeZoneChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedTimeZone = event.target.value;
    const parsedTimeZone = parseTimezone(selectedTimeZone);
    const gmtOffset = parsedTimeZone.offset;
    let gmtString;
    if (gmtOffset) {
      gmtString =
        parseInt(gmtOffset?.toString()) >= 0
          ? `GMT+${gmtOffset}`
          : `GMT${gmtOffset}`;
    }

    setTimeZone(gmtString);
    setSelectedLabel(selectedTimeZone);
  };

  return (
    <Fragment>
      <label
        htmlFor="timeZone"
        className="text-[14px] font-normal text-[#838187] leading-[2rem] md:leading-none "
      >
        Time Zone<span className="text-[#E04F64]">*</span>
      </label>
      <select
        value={selectedLabel}
        onChange={handleTimeZoneChange}
        name="timeZone"
        id="timeZone"
        className="w-full appearance-none rounded-lg px-[22px] py-[16px] text-[14px] font-normal text-[#222222] focus:outline-none"
        style={{ border: "1px solid #87878D" }}
      >
        {options.map((geographicTimeZone: ITimezoneOption) => (
          <option
            key={geographicTimeZone.value}
            value={geographicTimeZone.value}
          >
            {`${geographicTimeZone.label} ${geographicTimeZone.value}`}
          </option>
        ))}
      </select>
    </Fragment>
  );
};

export default TimeZoneSelect;
