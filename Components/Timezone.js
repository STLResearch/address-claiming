import { useState } from 'react';
import moment from 'moment-timezone';

const TimezoneSelectComponent = (props) => {
  const [timezone, setTimezone] = useState('UTC');

  const timezones = moment.tz.names().map((tz) => {
    return { value: tz, label: tz };
  });

  return (
    <>
      <label htmlFor='timezoneSelect'>Select Timezone:</label>
      <select
        id='timezoneSelect'
        defaultValue={props.timeZone}
        className='rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown'
        style={{ width: '143px', height: '27px' }}
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
