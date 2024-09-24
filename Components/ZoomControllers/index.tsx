import React from "react";
import { ZoomInIcon, ZoomOutIcon } from "../Icons";
import { handleZoomIn, handleZoomOut } from "@/utils/maputils";

interface PropsI {
  map: any;
}
const ZoomControllers = ({ map }: PropsI) => {
  return (
    <div className="z-50 absolute  bottom-1/3 right-[14px] -translate-x-[19px] translate-y-[28px] w-[52px] rounded-lg bg-white bg-opacity-50 flex flex-col items-center justify-center gap-2.5 p-2.5 shadow-md">
      <div
        className="w-[32px] h-[32px] flex justify-center"
        onClick={() => handleZoomIn(map)}
      >
        <ZoomInIcon />
      </div>
      <div
        className="w-[32px] h-[32px] flex justify-center"
        onClick={() => handleZoomOut(map)}
      >
        <ZoomOutIcon />
      </div>
    </div>
  );
};

export default ZoomControllers;
