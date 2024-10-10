import React from "react";

interface TimeSelectProps {
  isDayAvailable: boolean;
  fromTime: number;
  toTime: number;
  handleFromTimeChange: (time: number) => void;
  handleToTimeChange: (time: number) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({
  isDayAvailable,
  fromTime,
  toTime,
  handleFromTimeChange,
  handleToTimeChange,
}) => {
  const options = Array.from({ length: 25 });

  return (
    <div className="mt-2 flex items-center gap-[66px]">
      <select
        disabled={!isDayAvailable}
        value={fromTime}
        onChange={(e) => handleFromTimeChange(+e.target.value)}
        className="appearance-none rounded-lg px-[22px] py-[5px] text-[14px] font-normal text-[#87878D] focus:outline-none"
        style={{ border: "1px solid #87878D" }}
      >
        {options.map((_, index) => (
          <option key={`start-${index}`} value={index}>
            {index.toString().padStart(2, "0")}:00
          </option>
        ))}
      </select>
      <p>to</p>
      <select
        disabled={!isDayAvailable}
        value={toTime}
        onChange={(e) => handleToTimeChange(+e.target.value)}
        className="appearance-none rounded-lg px-[22px] py-[5px] text-[14px] font-normal text-[#87878D] focus:outline-none"
        style={{ border: "1px solid #87878D" }}
      >
        {options.map((_, index) => (
          <option key={`end-${index}`} value={index}>
            {index.toString().padStart(2, "0")}:00
          </option>
        ))}
      </select>
    </div>
  );
};
export default TimeSelect;
