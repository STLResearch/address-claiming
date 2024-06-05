import React, { useEffect } from "react";
import WeekDayRangeItem from "./WeekDayRangeItem";

interface WeekDayRange {
  fromTime: number;
  toTime: number;
  isAvailable: boolean;
  weekDayId: number;
}

interface WeekDayRangesFormProps {
  weekDayRanges: WeekDayRange[];
  setWeekDayRanges: React.Dispatch<React.SetStateAction<WeekDayRange[]>>;
}

const WeekDayRangesForm: React.FC<WeekDayRangesFormProps> = ({ weekDayRanges, setWeekDayRanges }) => {
  const weekDays = [
    "SUNDAYS",
    "MONDAYS",
    "TUESDAYS",
    "WEDNESDAYS",
    "THURSDAYS",
    "FRIDAYS",
    "SATURDAYS",
  ];

  useEffect(() => {
    const defaultWeekDayRanges = weekDayRanges.map((day) => ({
      isAvailable: true,
      fromTime: 9,
      toTime: 21,
      weekDayId: day.weekDayId,
    }));
    setWeekDayRanges(defaultWeekDayRanges);
  }, []);

  const handleToggle = (day: number) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].isAvailable = !weekDayRangesCopy[day].isAvailable;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleFromTimeChange = (day: number, time: number) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].fromTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  const handleToTimeChange = (day: number, time: number) => {
    const weekDayRangesCopy = [...weekDayRanges];
    weekDayRangesCopy[day].toTime = time;
    setWeekDayRanges(weekDayRangesCopy);
  };

  return (
    <>
      {weekDays.map((day, index) => (
        <WeekDayRangeItem
          key={index}
          day={day}
          isDayAvailable={weekDayRanges[index].isAvailable}
          fromTime={weekDayRanges[index].fromTime}
          toTime={weekDayRanges[index].toTime}
          handleToggle={() => handleToggle(index)}
          handleFromTimeChange={(time) => handleFromTimeChange(index, time)}
          handleToTimeChange={(time) => handleToTimeChange(index, time)}
        />
      ))}
    </>
  );
};

export default WeekDayRangesForm;
