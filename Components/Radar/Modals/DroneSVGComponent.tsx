import React from "react";

interface DroneSVGComponentProps {
  droneColor: string;
  direction: number;
}

const DroneSVGComponent: React.FC<DroneSVGComponentProps> = ({
  droneColor,
  direction,
}) => {
  return (
    <div
      className={`svg-container w-9 h-9 z-[100] `}
      style={{
        transform: direction !== 361 ? `rotate(${direction}deg)` : "none",
      }}
    >
      <div className="flex flex-col items-center justify-center">
        {Math.floor(direction) != 361 && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 6 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 0L5.59808 4.5L0.401924 4.5L3 0Z"
              fill={droneColor ? `${droneColor} ` : '#0000FF'}
              stroke="white"
              strokeWidth={0.3}
            />
          </svg>
        )}
        <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none">
          <path
            d="M10.5898 10.2349H14.5898V14.2349H10.5898V10.2349Z"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5898 10.2349L7.08984 6.73486"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5507 6.23477C10.4588 5.59134 10.1894 4.98622 9.77295 4.48723C9.35646 3.98823 8.80925 3.61507 8.19262 3.40955C7.576 3.20403 6.91433 3.17428 6.28174 3.32362C5.64916 3.47297 5.07066 3.79551 4.61106 4.25511C4.15146 4.71471 3.82892 5.29321 3.67958 5.92579C3.53024 6.55837 3.55999 7.22004 3.76551 7.83667C3.97103 8.45329 4.34419 9.0005 4.84318 9.417C5.34218 9.83349 5.94729 10.1028 6.59073 10.1948"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5898 10.2349L18.0898 6.73486"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.5889 10.1948C19.2323 10.1028 19.8375 9.83349 20.3365 9.417C20.8354 9.0005 21.2086 8.45329 21.4141 7.83667C21.6196 7.22004 21.6494 6.55837 21.5001 5.92579C21.3507 5.29321 21.0282 4.71471 20.5686 4.25511C20.109 3.79551 19.5305 3.47297 18.8979 3.32362C18.2653 3.17428 17.6036 3.20403 16.987 3.40955C16.3704 3.61507 15.8232 3.98823 15.4067 4.48723C14.9902 4.98622 14.7209 5.59134 14.6289 6.23477"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5898 14.2349L18.0898 17.7349"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.6289 18.2349C14.7209 18.8783 14.9902 19.4835 15.4067 19.9824C15.8232 20.4814 16.3704 20.8546 16.987 21.0601C17.6036 21.2656 18.2653 21.2954 18.8979 21.1461C19.5305 20.9967 20.109 20.6742 20.5686 20.2146C21.0282 19.755 21.3507 19.1765 21.5001 18.5439C21.6494 17.9113 21.6196 17.2496 21.4141 16.633C21.2086 16.0164 20.8354 15.4692 20.3365 15.0527C19.8375 14.6362 19.2323 14.3669 18.5889 14.2749"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5898 14.2349L7.08984 17.7349"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.59073 14.2749C5.94729 14.3669 5.34218 14.6362 4.84318 15.0527C4.34419 15.4692 3.97103 16.0164 3.76551 16.633C3.55999 17.2496 3.53024 17.9113 3.67958 18.5439C3.82892 19.1765 4.15146 19.755 4.61106 20.2146C5.07066 20.6742 5.64916 20.9967 6.28174 21.1461C6.91433 21.2954 7.576 21.2656 8.19262 21.0601C8.80925 20.8546 9.35646 20.4814 9.77295 19.9824C10.1894 19.4835 10.4588 18.8783 10.5507 18.2349"
            stroke={droneColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default DroneSVGComponent;