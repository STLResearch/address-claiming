import React from "react";
import {
  RectangleIcon,
  ClearIcon,
  DroneradarIcon,
  ChevronLeftIcon,
} from "../Icons";
const RadarModal = ({ onClose, DroneDataDetailSelected }) => {
  function formatTimeAgoFromMilliseconds(timestamp) {
    const currentTime = Date.now();
    const elapsedTime = currentTime - timestamp;
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes} ago`;
    return formattedTime;
  }
  function convertToTimestampDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    const utcMonth = ("0" + (date.getUTCMonth() + 1)).slice(-2);
    const utcDay = ("0" + date.getUTCDate()).slice(-2);
    const formattedDate = `${utcMonth}/${utcDay}`;
    return formattedDate;
  }
  return (
    <div className="z-50  mt-4 md:ml-12  bg-white  md:bg-[#FFFFFFCC] no-scrollbar rounded-[30px] w-full h-full md:max-w-sm  md:max-h-[600px] max-w-[600px] px-[25px] md:py-[12px] fixed md:rounded-[30px]  mx-auto overflow-x-auto overflow-y-auto flex flex-col gap-[15px] pb-[6rem] md:pb-0 ">
      <div className=" flex justify-end items-center mt-4 md:mt-0 ">
        <div className=" w-[90%] flex justify-center  items-center  md:hidden">
          <RectangleIcon />
        </div>
        <div onClick={onClose} className="cursor-pointer">
          <ClearIcon />
        </div>
      </div>

      <div className="flex   items-center  md:justify-center mt-2 md:mt-0 ">
        <div className="w-[20%] md:hidden ">
          <ChevronLeftIcon />
        </div>
        <div className=" w-[60%] break-words text-center flex gap-[10px] justify-center items-center">
          <DroneradarIcon />
          <h1 className="text-[20px] font-[500] overflow-auto">
            {DroneDataDetailSelected?.id}
          </h1>
        </div>
      </div>
      <div>
        <p className=" text-[14px]  text-[#4285F4] font-semibold leading-[2rem] mt-2 md:mt-0">
          CONNECTION
        </p>

        <div>
          <div className="border-t-2 my-4"></div>
          <div>
            <div className="flex   gap-[12px]  leading-[20px] ">
              <div className="w-[60%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  RSSI{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.connection?.rssi} dBm
                    Beacon
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Started{" "}
                  <span className="text-[#222222] overflow-auto">
                    {formatTimeAgoFromMilliseconds(
                      DroneDataDetailSelected?.remoteData?.connection?.firstSeen
                    )}{" "}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Msg{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.connection?.msgDelta}s
                  </span>
                </p>
              </div>
              <div className="w-[40%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  MAC{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.connection
                        ?.macAddress
                    }
                  </span>
                </p>
                <div className="flex text-[#838187] text-[10px] gap-[10px]">
                  <pre>Last seen </pre>
                  <span className="text-[#222222] overflow-auto">
                    {formatTimeAgoFromMilliseconds(
                      DroneDataDetailSelected?.remoteData?.connection?.lastSeen
                    )}{" "}
                  </span>
                </div>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Distance{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.location?.distance}m
                  </span>
                </p>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              BASIC ID 1
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex gap-[1rem] leading-[20px]">
              <div className="w-[60%] gap-[12px] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Type{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.identification1
                        ?.uaType
                    }
                  </span>
                </p>
                <div className="flex text-[#838187] text-[10px] gap-[10px]">
                  <pre>UAS ID</pre>
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.identification1
                        ?.uasId
                    }
                  </span>
                </div>
              </div>
              <div className="w-[40%] break-words">
                <div className="flex text-[#838187] text-[10px] gap-[10px]">
                  <pre>ID Type</pre>
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.identification1
                        ?.idType
                    }
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              BASIC ID 2
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex   gap-[12px]   leading-[20px] ">
              <div className="w-[60%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Type{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.identification2
                        ?.uaType
                    }
                  </span>
                </p>
                <div className="flex text-[#838187] text-[10px] gap-[10px]">
                  <pre>UAS ID</pre>
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.identification2
                        ?.uasId
                    }
                  </span>
                </div>
              </div>
              <div className="w-[40%] break-words">
                <div className="flex text-[#838187] text-[10px] gap-[10px] ">
                  <pre>ID Type</pre>
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.identification2
                        ?.idType
                    }
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              LOCATION
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex   gap-[12px]    leading-[20px] ">
              <div className="w-[60%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Latitude{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.location?.latitude}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Altitude Press{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.altitudePressure
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Direction{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.location?.direction}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Horizontal Speed{" "}
                  <span className="text-[#222222] overflow-auto">
                    {(
                      parseFloat(
                        DroneDataDetailSelected?.remoteData?.location
                          ?.speedHorizontal
                      ) / 100
                    ).toFixed(2)}
                    m/s
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Height{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.location?.height}m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Horizontal Accuracy{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.horizontalAccuracy
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Baro Acc.{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.baroAccuracy
                    }
                    m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Time Acc.{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.timeAccuracy
                    }
                    s
                  </span>
                </p>
              </div>
              <div className="w-[40%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  {" "}
                  Longitude{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.location?.longitude}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Altitude Geod{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.altitudeGeodetic
                    }
                    m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Status{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.location?.status}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Vertical Speed{" "}
                  <span className="text-[#222222] overflow-auto">
                    {(
                      parseFloat(
                        DroneDataDetailSelected?.remoteData?.location
                          ?.speedVertical
                      ) / 100
                    ).toFixed(2)}
                    m/s
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Height Over{" "}
                  <span className="text-[#222222] overflow-auto">Ground</span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Vertical Accuracy
                  <span className="text-[#222222] ">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.verticalAccuracy
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Speed Acc.
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.speedAccuracy
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Timestamp
                  <span className="text-[#222222] overflow-auto">
                    {convertToTimestampDate(
                      DroneDataDetailSelected?.remoteData?.location
                        ?.locationTimestamp
                    )}
                  </span>
                </p>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              SELF ID
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex  gap-[12px]  leading-[20px]">
              <div className="w-[60%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Operation{" "}
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.id}
                  </span>
                </p>
              </div>
              <div className="w-[40%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Type{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.selfId
                        ?.descriptionType
                    }
                  </span>
                </p>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              SYSTEM OPERATOR
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex   gap-[12px]    leading-[20px] ">
              <div className="w-[60%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Location Type{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorLocationType
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Latitude
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorLatitude
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area Count
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.system?.areaCount}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area Celling
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.system?.areaCeiling}m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Classification
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.classificationType
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Category
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.system?.category}
                  </span>
                </p>
              </div>
              <div className="w-[40%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Altitude
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorAltitudeGeo
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Longitude
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorLongitude
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area radius
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.system?.areaRadius}m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area floor
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.system?.areaFloor} m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Class
                  <span className="text-[#222222] overflow-auto">
                    {DroneDataDetailSelected?.remoteData?.system?.classValue}
                  </span>
                </p>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              OPERATOR ID
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex  gap-[12px]    leading-[20px] mb-4">
              <div className="w-[60%] break-words">
                <div className="flex text-[#838187] text-[10px] gap-[10px]">
                  <pre>Operation IF</pre>
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.operatorId
                        ?.operatorId
                    }
                  </span>
                </div>
              </div>
              <div className="w-[40%] break-words">
                <p className="flex text-[#838187] text-[10px] gap-[10px] mb-[43px] md:mb-0">
                  Type{" "}
                  <span className="text-[#222222] overflow-auto">
                    {
                      DroneDataDetailSelected?.remoteData?.operatorId
                        ?.operatorIdType
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RadarModal;
