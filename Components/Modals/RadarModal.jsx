import React from "react";
import {
  RectangleIcon,
  ClearIcon,
  DroneradarIcon,
  ChevronLeftIcon,
} from "../Icons";
const RadarModal = ({ onClose, DroneDataDetailSelected }) => {
  let truncatedId =
    DroneDataDetailSelected?.id?.length > 10
      ? DroneDataDetailSelected?.id.substring(0, 10) + "..."
      : DroneDataDetailSelected?.id;
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
        <div className=" w-[60%]  flex gap-[10px] justify-center items-center">
          <DroneradarIcon />
          <h1 className="text-[20px] font-[500]">{truncatedId}</h1>
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
              <div className="w-[60%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  RSSI{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.connection?.rssi} dBm
                    Beacon
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Started{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.connection?.firstSeen}{" "}
                    ago
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Msg{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.connection?.msgDelta}s
                  </span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  MAC{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.connection
                        ?.macAddress
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Last seen{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.connection?.lastSeen}{" "}
                    ago
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Distance <span className="text-[#222222]">{DroneDataDetailSelected?.remoteData?.location?.distance}m</span>
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
              <div className="w-[60%] gap-[12px]">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Type{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.id1Shadow?.type}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  UAS ID{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.id1Shadow?.uasId}
                  </span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  ID Type{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.id1Shadow?.idType}
                  </span>
                </p>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              BASIC ID 2
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex   gap-[12px]   leading-[20px] ">
              <div className="w-[60%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Type{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.id2Shadow?.uaType}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  UAS ID{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.id2Shadow?.uasId}
                  </span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  ID Type{" "}
                  {DroneDataDetailSelected?.remoteData?.id2Shadow?.idType}
                </p>
              </div>
            </div>
            <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
              LOCATION
            </h1>
          </div>
          <div className="border-t-2 my-2"></div>
          <div>
            <div className="flex   gap-[12px]    leading-[20px] ">
              <div className="w-[60%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Latitude{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.location?.latitude}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Altitude Press{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.altitudePressure
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Direction{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.location?.direction}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Horizontal Speed{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.speedHorizontal
                    }
                    m/s
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Height{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.location?.height}m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Horizontal Accuracy{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.horizontalAccuracy
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Baro Acc.{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.baroAccuracy
                    }
                    m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Time Acc.{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.timeAccuracy
                    }
                    s
                  </span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  {" "}
                  Longitude{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.location?.longitude}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Altitude Geod{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.altitudeGeodetic
                    }
                    m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Status{" "}
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.location?.status}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Vertical Speed{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.speedVertical
                    }
                    m/s
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Height Over <span className="text-[#222222]">Ground</span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Vertical Accuracy
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.verticalAccuracy
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Speed Acc.
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.speedAccuracy
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Timestamp
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.location
                        ?.locationTimestamp
                    }
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
              <div className="w-[60%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Operation <span className="text-[#222222]">Drone ID</span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Type <span className="text-[#222222]">0</span>
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
              <div className="w-[60%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Location Type{" "}
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorLocationType
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Latitude
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorLatitude
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area Count
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.system?.areaCount}
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area Celling
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.system?.areaCeiling}m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Classification
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.classificationType
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Category
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.system?.category}
                  </span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Altitude
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorAltitudeGeo
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Longitude
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.system
                        ?.operatorLongitude
                    }
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area radius
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.system?.areaRadius}m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Area floor
                  <span className="text-[#222222]">
                    {DroneDataDetailSelected?.remoteData?.system?.areaFloor} m
                  </span>
                </p>
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Class
                  <span className="text-[#222222]">
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
              <div className="w-[60%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px]">
                  Operation IF
                  <span className="text-[#222222]">
                    {
                      DroneDataDetailSelected?.remoteData?.operatorId
                        ?.operatorId
                    }
                  </span>
                </p>
              </div>
              <div className="w-[40%] ">
                <p className="flex text-[#838187] text-[10px] gap-[10px] mb-[43px] md:mb-0">
                  Type{" "}
                  <span className="text-[#222222]">
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
