import React, { useRef } from "react";
import Image from "next/image";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map } from "mapbox-gl";

interface PolygonToolProps {
  drawTool: MapboxDraw;
  isDrawMode: boolean;
  setDrawMode: React.Dispatch<React.SetStateAction<boolean>>;
  map: Map | null;
}

const PolygonTool = ({ drawTool, isDrawMode, setDrawMode, map }: PolygonToolProps) => {
  const ref = useRef(false);

  const deletePolygon = () => {
    const selectedFeatures = drawTool.getSelectedIds();
    if (selectedFeatures.length > 0) {
      drawTool.delete(selectedFeatures);
      setDrawMode(false);
    }
  };

  return (
    <div className="hidden md:block">
      <div
        className="absolute right-0 top-0 z-20 m-4 rounded-lg bg-light-grey-100"
        style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
      >
        <div className="flex items-center gap-[2rem] p-4">
          <p className="text-sm font-normal">Location is not exact?</p>
          <button
            className={`rounded-lg px-2 py-2 ${isDrawMode && "bg-pure-blue"} group hover:bg-pure-blue`}
            onClick={() => {
              if (drawTool) {
                if (!ref.current) {
                  map?.addControl(drawTool);
                  ref.current = true;
                }
                drawTool?.changeMode("draw_polygon");
                setDrawMode(true);
              }
            }}
          >
            <div className="flex gap-2">
              <p className={`text-sm font-normal text-black group-hover:text-white ${isDrawMode && "text-white"} `}>
                Draw
              </p>
              <Image
                src="/images/draw.svg"
                alt="draw"
                width={18}
                height={18}
                className={`group-hover:invert group-hover:filter ${isDrawMode && "invert filter"} `}
              />
            </div>
          </button>

          <button
            className="group rounded-lg px-2 py-2 hover:bg-pure-blue"
            onClick={() => {
              deletePolygon();
            }}
          >
            <div className="flex gap-2">
              <p className="text-sm font-normal text-black group-hover:text-white">Delete</p>
              <Image
                src="/images/delete.svg"
                alt="drag-pan"
                width={18}
                height={18}
                className="group-hover:invert group-hover:filter"
              />
            </div>
          </button>
        </div>
      </div>
      {isDrawMode && (
        <div className="absolute right-2 top-28 z-20 w-[410px] rounded-lg bg-white p-4">
          <p className="text-[13px]">
            Please ensure the address entered matches the registered property address to accurately claim this area.
          </p>
        </div>
      )}
    </div>
  );
};

export default PolygonTool;
