import { useState } from "react";
import moment from "moment-timezone";

const TimezoneSelectComponent = (props) => {
    const [timezone, setTimezone] = useState('UTC');
  
    const timezones = moment.tz.names().map(tz => {
      return { value: tz, label: tz };
    });
  
    return (
      <>
        <label htmlFor="timezoneSelect">Select Timezone:</label>
        <select 
          id="timezoneSelect"
          value={props.timezone} 
          // onChange={(e) => setTimezone(e.target.value)}
          className="bg-light-blue ps-2 placeholder:text-sml text-dark-brown text-sml placeholder:text-light-brown rounded-sm"
          style={{width: "143px", height: "27px"}}
          disabled={props.disable}
          onChange={props.onChange}
        >
          {timezones.map(tz => (
            <option selected={tz.value === props.timeZone} key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </>
    );
  }

  export default TimezoneSelectComponent;