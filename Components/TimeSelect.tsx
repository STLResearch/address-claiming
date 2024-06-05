import React from "react";

interface TimeSelectProps {
  fromChange: (value: string) => void;
  toChange: (value: string) => void;
  timeSelect?: string;
  toTimeSelect?: string;
  disable?: boolean;
}

const TimeSelect: React.FC<TimeSelectProps> = (props) => {
  const fromChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.fromChange(e.target.value);
  };

  const toChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.toChange(e.target.value);
  };

  return (
    <div className="flex flex-row justify-between gap-3">
      <select
        onChange={fromChangeHandler}
        defaultValue={props.timeSelect || "7"}
        disabled={props.disable}
        className="rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown"
        style={{ width: "90px", height: "27px" }}
      >
        <option disabled>From</option>
        <option value="0">00:00</option>
        <option value="1">01:00</option>
        <option value="2">02:00</option>
        <option value="3">03:00</option>
        <option value="4">04:00</option>
        <option value="5">05:00</option>
        <option value="6">06:00</option>
        <option value="7">07:00</option>
        <option value="8">08:00</option>
        <option value="9">09:00</option>
        <option value="10">10:00</option>
        <option value="11">11:00</option>
        <option value="12">12:00</option>
        <option value="13">13:00</option>
        <option value="14">14:00</option>
        <option value="15">15:00</option>
        <option value="16">16:00</option>
        <option value="17">17:00</option>
        <option value="18">18:00</option>
        <option value="19">19:00</option>
        <option value="20">20:00</option>
        <option value="21">21:00</option>
        <option value="22">22:00</option>
        <option value="23">23:00</option>
      </select>
      <select
        onChange={toChangeHandler}
        defaultValue={props.toTimeSelect || "22"}
        disabled={props.disable}
        className="rounded-sm bg-light-blue ps-2 text-sml text-dark-brown placeholder:text-sml placeholder:text-light-brown"
        style={{ width: "90px", height: "27px" }}
      >
        <option disabled>To</option>
        <option value="0">00:00</option>
        <option value="1">01:00</option>
        <option value="2">02:00</option>
        <option value="3">03:00</option>
        <option value="4">04:00</option>
        <option value="5">05:00</option>
        <option value="6">06:00</option>
        <option value="7">07:00</option>
        <option value="8">08:00</option>
        <option value="9">09:00</option>
        <option value="10">10:00</option>
        <option value="11">11:00</option>
        <option value="12">12:00</option>
        <option value="13">13:00</option>
        <option value="14">14:00</option>
        <option value="15">15:00</option>
        <option value="16">16:00</option>
        <option value="17">17:00</option>
        <option value="18">18:00</option>
        <option value="19">19:00</option>
        <option value="20">20:00</option>
        <option value="21">21:00</option>
        <option value="22">22:00</option>
        <option value="23">23:00</option>
      </select>
    </div>
  );
};

export default TimeSelect;
