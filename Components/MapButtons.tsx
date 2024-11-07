import React from "react";

interface MapButtonsProps {
  showRestrictedAreas: boolean;
  setShowRestrictedAreas: (value: boolean) => void;
  isButtonVisible: boolean;
  setIsButtonVisible: (value: boolean) => void;
  setClickCount: (callback: (prevCount: number) => number) => void;
  setShowRestrictedAreasInfo: (callback: (prev: boolean) => boolean) => void;
  messages: { text: string; address: string }[];
}

const MapButtons: React.FC<MapButtonsProps> = ({
  showRestrictedAreas,
  setShowRestrictedAreas,
  isButtonVisible,
  setIsButtonVisible,
  setClickCount,
  setShowRestrictedAreasInfo,
  messages,
}) => {
  return (
    <div className="absolute top-28 right-4 flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row items-center z-10">
      {/* Button to toggle restricted areas */}
      <button
        onClick={() => {
          setShowRestrictedAreas(!showRestrictedAreas);
          setIsButtonVisible(!isButtonVisible);
        }}
        className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors duration-200 h-10 w-full md:w-auto ${
          showRestrictedAreas
            ? "bg-white bg-opacity-80"
            : "bg-white bg-opacity-80"
        } hover:bg-opacity-20`}
      >
        <span className="text-sm md:text-base">Turn On Restricted Areas</span>
        <div
          className={`ml-2 p-1 ${showRestrictedAreas ? "bg-blue-500" : "bg-white"} rounded-md`}
        >
          {/* Icon for restricted areas */}
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke={showRestrictedAreas ? "white" : "black"}
          >
            <path
              d="M17.0625 5.25L15.7792 6.2125C15.4762 6.43969 15.1078 6.5625 14.7292 6.5625H11.7906C11.2678 6.5625 10.7898 6.85791 10.556 7.32556V7.32556C10.2674 7.90266 10.4171 8.60266 10.9165 9.01124L12.6665 10.443C14.0437 11.5698 14.7564 13.3175 14.5599 15.0861L14.5194 15.4505C14.465 15.9404 14.3589 16.4233 14.203 16.891L14 17.5"
              strokeWidth="1.75"
            />
            <path
              d="M2.1875 9.1875L5.02084 8.71528C6.20527 8.51787 7.23213 9.54473 7.03472 10.7292L6.91702 11.4354C6.7063 12.6997 7.34484 13.9537 8.49132 14.5269V14.5269C9.40934 14.9859 9.88539 16.021 9.63645 17.0167L9.1875 18.8125"
              strokeWidth="1.75"
            />
            <circle cx="10.5" cy="10.5" r="7.875" strokeWidth="1.75" />
          </svg>
        </div>
      </button>

      {/* Button to toggle radar functionality */}
      <button className="flex items-center justify-between px-4 py-2 rounded-md h-10 bg-white bg-opacity-80 hover:bg-opacity-50 transition-colors duration-200 w-full md:w-auto">
        <span className="mr-2 text-sm md:text-base">Turn On Radar</span>
        <div className="flex items-center justify-center w-10 h-8 bg-white border ml-2 p-1 rounded-md">
          {/* Icon for radar */}
          <svg
            width="25"
            height="13"
            viewBox="0 0 25 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.3125 0.25C5.70312 0.25 6.05469 0.523438 6.17188 0.875H10.3125C10.8203 0.875 11.25 1.30469 11.25 1.8125C11.25 2.35938 10.8203 2.75 10.3125 2.75H0.9375C0.390625 2.75 0 2.35938 0 1.8125C0 1.30469 0.390625 0.875 0.9375 0.875H4.41406C4.53125 0.523438 4.88281 0.25 5.3125 0.25ZM18.7891 0.875C18.9062 0.523438 19.2578 0.25 19.6875 0.25C20.0781 0.25 20.4297 0.523438 20.5469 0.875H24.0625C24.5703 0.875 25 1.30469 25 1.8125C25 2.35938 24.5703 2.75 24.0625 2.75H14.6875C14.1406 2.75 13.75 2.35938 13.75 1.8125C13.75 1.30469 14.1406 0.875 14.6875 0.875H18.7891ZM4.375 6.5V4H6.25V5.95312L6.64062 6.1875L8.51562 5.09375C9.72656 4.39062 11.0938 4 12.5 4C13.8672 4 15.2344 4.39062 16.4453 5.09375L18.3203 6.1875L18.75 5.95312V4H20.625V6.5C20.625 6.85156 20.4297 7.20312 20.1172 7.35938L18.0859 8.41406L18.2812 8.60938C18.9844 9.46875 19.375 10.5234 19.375 11.6172V11.8125C19.375 12.3594 18.9453 12.75 18.4375 12.75C17.8906 12.75 17.5 12.3594 17.5 11.8125V11.6172C17.5 10.9531 17.2656 10.3281 16.8359 9.82031L16.4062 9.3125L14.8047 10.1719C14.6484 10.2109 14.5312 10.25 14.375 10.25H10.625C10.4688 10.25 10.3125 10.2109 10.1562 10.1719L8.55469 9.3125L8.125 9.82031C7.69531 10.3281 7.5 10.9531 7.5 11.6172V11.8125C7.5 12.3594 7.07031 12.75 6.5625 12.75C6.01562 12.75 5.625 12.3594 5.625 11.8125V11.6172C5.625 10.5234 5.97656 9.46875 6.67969 8.60938L6.875 8.41406L4.84375 7.35938C4.53125 7.20312 4.33594 6.85156 4.33594 6.5H4.375ZM12.5 7.25C11.5234 7.25 10.5859 7.5 9.80469 8L8.86719 8.52344L10.8203 9.59375H14.1406L16.0938 8.52344L15.1953 8C14.4141 7.5 13.4766 7.25 12.5 7.25Z"
              fill="black"
            />
          </svg>
        </div>
      </button>

      {/* Filter Button */}
      <button
        onClick={() => setShowRestrictedAreasInfo((prev) => !prev)}
        className="flex items-center justify-between px-4 py-2 rounded-md h-10 bg-white bg-opacity-80 hover:bg-opacity-50 transition-colors duration-200 w-full md:w-auto"
      >
        <span className="mr-2 text-sm md:text-base">Filter</span>
        <div className="flex items-center justify-center w-10 h-8 bg-white border ml-2 p-1 rounded-md">
          {/* Filter icon */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="34" height="34" rx="8" fill="white" />
            <path
              d="M8.5 10.625C8.5 10.625 14.4242 10.625 18.0625 10.625M21.25 8.5V10.625M21.25 12.75V10.625M21.25 10.625H25.5"
              stroke="#222222"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.5 23.375C8.5 23.375 11.2367 23.375 14.875 23.375M18.0625 21.25V23.375M18.0625 25.5V23.375M18.0625 23.375H25.5"
              stroke="#222222"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M25.5 16.291C25.5 16.291 19.5758 16.291 15.9375 16.291M12.75 18.416L12.75 16.291M12.75 14.166L12.75 16.291M12.75 16.291L8.5 16.291"
              stroke="#222222"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </button>

      <div className="fixed right-4 bottom-[28%]">
        {isButtonVisible && (
          <button
            className="relative bg-[#E04F64] text-white p-3 mr-3.5 rounded-lg shadow-md hover:bg-red-600 transition-colors border-2 border-[#4c141c]"
            onClick={() => {
              setClickCount((prevCount) => prevCount + 1);
              setShowRestrictedAreasInfo((prev) => !prev);
            }}
            style={{ transform: "translateY(-100%)" }}
          >
            {/* Label for click count */}
            <span className="absolute -top-3 left-0.5 bg-red-900 text-white text-sm font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              {messages.length > 0 ? messages.length : 0}
            </span>

            {/* Icon */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" stroke="white" />
              <path d="M9.00012 15L15.0001 9" stroke="white" />
              <path d="M15 15L9 9" stroke="white" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MapButtons;
