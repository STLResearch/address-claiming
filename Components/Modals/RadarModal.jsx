import React from "react";
import { RectangleIcon,ClearIcon,DroneradarIcon,ChevronLeftIcon } from "../Icons";
const RadarModal = ({onClose,DroneDataDetailSelected}) => {
    console.log(DroneDataDetailSelected,"the data");
  return (
    <div className="">
      <div className="z-50  mt-4 md:ml-12  bg-white  md:bg-[#FFFFFFCC] no-scrollbar rounded-[30px] w-full h-full md:max-w-sm  md:max-h-[600px] max-w-[600px] px-[25px] md:py-[12px] fixed  md:rounded-[30px]  mx-auto overflow-x-auto overflow-y-auto flex flex-col gap-[15px] pb-[6rem] md:pb-0">
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
            <h1 className="text-[20px] font-[500]">{DroneDataDetailSelected?.name}</h1>
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
                    RSSI <span className="text-[#222222]">-40 dBm Beacon</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Started <span className="text-[#222222]">05:01 ago</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Msg <span className="text-[#222222]">2.6s</span>
                  </p>
                </div>
                <div className="w-[40%] ">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    MAC <span className="text-[#222222]">04:33:c2:67:1:45</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Last seen <span className="text-[#222222]">0:01 ago</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Distance <span className="text-[#222222]">68m</span>
                  </p>
                </div>
              </div>
              <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
                BASIC ID 1
              </h1>
            </div>
            <div className="border-t-2 my-2"></div>
            <div>
              <div className="flex   gap-[1rem]    leading-[20px] ">
                <div className="w-[60%] gap-[12px]">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Type{" "}
                    <span className="text-[#222222]">
                      Helicopter_or_Multirotor
                    </span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    UAS ID{" "}
                    <span className="text-[#222222]">112624150A90E31EC0</span>
                  </p>
                </div>
                <div className="w-[40%] ">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    ID Type{" "}
                    <span className="text-[#222222]">Serial Number</span>
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
                      Helicopter_or_Multirotor
                    </span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    UAS ID{" "}
                    <span className="text-[#222222]">112624150A90E31EC0</span>
                  </p>
                </div>
                <div className="w-[40%] ">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    ID Type{" "}
                    <span className="text-[#222222]">Serial Number</span>
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
                    Latitude <span className="text-[#222222]">51.4791000</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Altitude Press <span className="text-[#222222]">0.0m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Direction <span className="text-[#222222]">Unknown</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Horizontal Speed{" "}
                    <span className="text-[#222222]">0.00m/s</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Height <span className="text-[#222222]">0.00m/s</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Horizontal Accuracy{" "}
                    <span className="text-[#222222]">10m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Baro Acc. <span className="text-[#222222]">1m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Time Acc. <span className="text-[#222222]">0.1s</span>
                  </p>
                </div>
                <div className="w-[40%] ">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    {" "}
                    Longitude <span className="text-[#222222]">-0.0013000</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Altitude Geod <span className="text-[#222222]">110.0m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Status <span className="text-[#222222]">Airbone</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Vertical Speed{" "}
                    <span className="text-[#222222]">0.00 m/s</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Height Over <span className="text-[#222222]">Ground</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Vertical Accuracy<span className="text-[#222222]">68m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Speed Acc.<span className="text-[#222222]">1m/s</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Timestamp<span className="text-[#222222]">06/01</span>
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
                    <span className="text-[#222222]">TakeOff</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Latitude<span className="text-[#222222]">51.4791000</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Area Count<span className="text-[#222222]">1</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Area Celling<span className="text-[#222222]">0.0m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Classification<span className="text-[#222222]">EU</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Category<span className="text-[#222222]">EU_Open</span>
                  </p>
                </div>
                <div className="w-[40%] ">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Altitude<span className="text-[#222222]">-0.0013000</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Longitude<span className="text-[#222222]">-0.0013000</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Area radius<span className="text-[#222222]">0 m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Area floor<span className="text-[#222222]">0.00 m</span>
                  </p>
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Class<span className="text-[#222222]">EU_Class_1</span>
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
                    <span className="text-[#222222]">FIN87astrdge&éK8</span>
                  </p>
                </div>
                <div className="w-[40%] ">
                  <p className="flex text-[#838187] text-[10px] gap-[10px]">
                    Type <span className="text-[#222222]">0</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RadarModal;
