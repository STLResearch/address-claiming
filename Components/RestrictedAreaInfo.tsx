import React, { useState, useEffect } from "react";

interface ShowRestrictedAreaInfoProps {
  showRestrictedAreasInfo: boolean;
  setShowRestrictedAreasInfo: (value: boolean) => void;
  messages: { address: string; text: string }[];
}

const ShowRestrictedAreaInfo: React.FC<ShowRestrictedAreaInfoProps> = ({
  showRestrictedAreasInfo,
  setShowRestrictedAreasInfo,
  messages,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (showRestrictedAreasInfo) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [showRestrictedAreasInfo]);

  return (
    <div
      className={`absolute bottom-0 lg:left-[21rem] md:left-[12rem] sm:left-[8rem] z-30 w-[370px] max-h-[400px] p-4 bg-white rounded-t-[30px] shadow-md transform transition-all duration-500 ease-out ${
        animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-end justify-end gap-5 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-black cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => setShowRestrictedAreasInfo(false)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <div className="flex items-center gap-5 mb-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="9" stroke="#C91C1C" />
          <path d="M9.00012 15L15.0001 9" stroke="#C91C1C" />
          <path d="M15 15L9 9" stroke="#C91C1C" />
        </svg>

        <h3 className="text-xl font-semibold text-gray-700">
          Flight Restricted Airspace
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[200px] mt-4">
        <div className="flex flex-col space-y-4">
          {messages.map((messageObj, index) => (
            <div key={index} className="p-2 bg-white rounded-lg shadow-md">
              <div className="flex items-center space-x-2 mt-4 mb-4 mr-2">
                <svg
                  width="100"
                  height="100"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="15" cy="15" r="15" fill="#FFEAEA" />
                  <path
                    d="M15 12.0057H14.9999C14.6265 12.0057 14.2613 12.1127 13.9505 12.3133C13.6398 12.514 13.3973 12.7994 13.254 13.1337C13.1107 13.4679 13.0732 13.8358 13.1463 14.1908C13.2194 14.5458 13.3996 14.8716 13.6641 15.1271C13.9285 15.3827 14.2652 15.5565 14.6315 15.6269C14.9978 15.6973 15.3775 15.6612 15.7226 15.523C16.0678 15.3849 16.363 15.1508 16.5709 14.8501C16.7788 14.5495 16.8899 14.1958 16.8899 13.8338V13.8338C16.8893 13.3485 16.6896 12.8837 16.3351 12.5411C15.9807 12.1986 15.5005 12.0062 15 12.0057ZM14.9998 14.6729C14.8274 14.6729 14.659 14.6235 14.5159 14.5311C14.3728 14.4386 14.2615 14.3075 14.1959 14.1544C14.1303 14.0012 14.1131 13.8329 14.1466 13.6704C14.18 13.508 14.2626 13.3586 14.3841 13.2411C14.5057 13.1236 14.6608 13.0434 14.8299 13.0109C14.999 12.9784 15.1742 12.9951 15.3334 13.0588C15.4926 13.1226 15.6283 13.2303 15.7237 13.3683C15.8191 13.5062 15.8699 13.6682 15.8699 13.8338C15.8696 14.0557 15.7783 14.2688 15.6154 14.4262C15.4524 14.5837 15.2311 14.6726 14.9998 14.6729Z"
                    fill="#C91C1C"
                    stroke="#C91C1C"
                    stroke-width="0.1"
                  />
                  <path
                    d="M10.7688 16.4972L10.7688 16.4972L14.2449 21.6542C14.327 21.776 14.439 21.8758 14.5709 21.9448C14.7027 22.0139 14.8501 22.05 14.9998 22.05C15.1496 22.05 15.297 22.0139 15.4288 21.9448C15.5606 21.8758 15.6727 21.776 15.7548 21.6542L19.231 16.4972C19.8635 15.5589 20.1431 14.4388 20.0227 13.3247C19.9024 12.2106 19.3895 11.1706 18.5703 10.3789L18.5355 10.4149L18.5703 10.3789C17.6872 9.52576 16.5087 9.0192 15.2624 8.95658C14.0161 8.89397 12.7897 9.2797 11.8199 10.0397C10.8502 10.7997 10.2057 11.8803 10.0115 13.073C9.81729 14.2658 10.0872 15.4857 10.7688 16.4972ZM18.3772 15.956L14.9999 20.9664L11.6225 15.956C10.5897 14.4238 10.811 12.373 12.1495 11.0795C12.5236 10.7179 12.9679 10.431 13.457 10.2352C13.9461 10.0394 14.4704 9.93861 14.9999 9.93861C15.5294 9.93861 16.0536 10.0394 16.5427 10.2352C17.0318 10.431 17.4761 10.7179 17.8503 11.0795C19.1887 12.373 19.41 14.4238 18.3772 15.956Z"
                    fill="#C91C1C"
                    stroke="#C91C1C"
                    stroke-width="0.1"
                  />
                </svg>

                <span className="text-black bg-white">
                  {messageObj.address}
                </span>
              </div>

              <div className="bg-gray-100">
                <p className="m-4 mt-4 text-gray-600">{messageObj.text}</p>
                <p className="flex items-center font-semibold text-gray-600 justify-around">
                  Federal Aviation Administration
                  <span className="ml-2">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="13.0759"
                        cy="13"
                        rx="12.9241"
                        ry="13"
                        fill="#DDDDDD"
                      />
                      <path
                        d="M11.5267 8.83984L15.6625 12.9998L11.5267 17.1598"
                        stroke="#222222"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowRestrictedAreaInfo;
