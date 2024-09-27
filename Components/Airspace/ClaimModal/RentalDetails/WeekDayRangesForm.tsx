import React from "react";
import Toggle from "./Toggle";

interface WeekDayRange {
  fromTime: number;
  toTime: number;
  isAvailable: boolean;
  weekDayId: number;
}

interface PropsI {
  weekDayRanges: WeekDayRange[];
  setWeekDayRanges: React.Dispatch<React.SetStateAction<WeekDayRange[]>>;
}

const WeekDayRangesForm = ({ weekDayRanges, setWeekDayRanges }: PropsI) => {
  const weekDays = [
    "SUNDAYS",
    "MONDAYS",
    "TUESDAYS",
    "WEDNESDAYS",
    "THURSDAYS",
    "FRIDAYS",
    "SATURDAYS",
  ];

  const options = Array.from({ length: 25 });

  const handleToggle = (day) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].isAvailable = !weekDayRangesCopy[day].isAvailable;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleFromTimeChange = (day, time) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].fromTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleToTimeChange = (day, time) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].toTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  return weekDays.map((day, index) => {
    const isDayAvailable = weekDayRanges[index].isAvailable;

    return (
      <div
        className="flex-none md:flex items-center justify-between"
        key={index}
      >
        <div className="flex items-center gap-[15px] pr-[32px]">
          <Toggle
            checked={isDayAvailable}
            setChecked={() => handleToggle(index)}
          />
          <p>{day}</p>
        </div>
        <div className="flex items-center gap-[66px] mt-2">
          <select
            disabled={!isDayAvailable}
            value={weekDayRanges[index].fromTime}
            onChange={(e) => handleFromTimeChange(index, +e.target.value)}
            name={`${index}/start`}
            id={`${index}/start`}
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
            value={weekDayRanges[index].toTime}
            onChange={(e) => handleToTimeChange(index, +e.target.value)}
            name={`${index}/end`}
            id={`${index}/end`}
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
      </div>
    );
  });
};

export default WeekDayRangesForm;
