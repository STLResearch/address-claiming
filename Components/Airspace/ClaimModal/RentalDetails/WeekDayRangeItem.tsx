import React from "react";

import TimeSelect from "./TimeSelect";
import Toggle from "./Toggle";

interface WeekDayRangeItemProps {
  day: string;
  isDayAvailable: boolean;
  fromTime: number;
  toTime: number;
  handleToggle: () => void;
  handleFromTimeChange: (time: number) => void;
  handleToTimeChange: (time: number) => void;
}

const WeekDayRangeItem: React.FC<WeekDayRangeItemProps> = ({
  day,
  isDayAvailable,
  fromTime,
  toTime,
  handleToggle,
  handleFromTimeChange,
  handleToTimeChange,
}) => (
  <div className="flex-none md:flex items-center justify-between">
    <div className="flex items-center gap-[15px] pr-[32px]">
      <Toggle checked={isDayAvailable} setChecked={handleToggle} />
      <p>{day}</p>
    </div>
    <TimeSelect
      isDayAvailable={isDayAvailable}
      fromTime={fromTime}
      toTime={toTime}
      handleFromTimeChange={handleFromTimeChange}
      handleToTimeChange={handleToTimeChange}
    />
  </div>
);
export default WeekDayRangeItem;
