import React from "react";
import { ZoomInIcon, ZoomOutIcon } from "../Icons";
import { handleZoomIn, handleZoomOut } from "@/utils/maputils";

interface PropsI {
  map: any;
}
const ZoomControllers = ({ map }: PropsI) => {
  return (
    <div className="absolute bottom-1/3 right-[14px] z-50 flex w-[52px] -translate-x-[19px] translate-y-[28px] flex-col items-center justify-center gap-2.5 rounded-lg bg-white bg-opacity-50 p-2.5 shadow-md">
      <div className="flex h-[32px] w-[32px] justify-center" onClick={() => handleZoomIn(map)}>
        <ZoomInIcon />
      </div>
      <div className="flex h-[32px] w-[32px] justify-center" onClick={() => handleZoomOut(map)}>
        <ZoomOutIcon />
      </div>
    </div>
  );
};

export default ZoomControllers;
