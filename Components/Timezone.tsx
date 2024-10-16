import React, { useState } from "react";
import moment from "moment-timezone";

interface TimezoneSelectComponentProps {
  timeZone?: string;
  disable?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TimezoneSelectComponent: React.FC<TimezoneSelectComponentProps> = (
  props,
) => {
  const [timezone, setTimezone] = useState<string>("UTC");

  const timezones = moment.tz.names().map((tz) => {
    return { value: tz, label: tz };
  });

  return (
    <>
      <label htmlFor="timezoneSelect">Select Timezone:</label>
      <select
        id="timezoneSelect"
        defaultValue={props.timeZone}
        className="rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown"
        style={{ width: "143px", height: "27px" }}
        disabled={props.disable}
        onChange={props.onChange}
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default TimezoneSelectComponent;
