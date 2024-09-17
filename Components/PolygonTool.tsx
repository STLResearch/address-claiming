import React, { useRef } from 'react';
import Image from 'next/image';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Map } from 'mapbox-gl';

interface PolygonToolProps {
  drawTool: MapboxDraw; 
  isDrawMode: boolean; 
  setDrawMode: React.Dispatch<React.SetStateAction<boolean>>
  map: Map | null
}

const PolygonTool = ({ drawTool,isDrawMode, setDrawMode, map }: PolygonToolProps) => {
  const ref = useRef(false)

  const deletePolygon = () => {
    const selectedFeatures = drawTool.getSelectedIds();
    if (selectedFeatures.length > 0) {
      drawTool.delete(selectedFeatures);
      setDrawMode(false)
    }
  };
  
  return (
    <div className='hidden sm:block'>
    <div
      className="absolute top-0 right-0 bg-light-grey-100 rounded-lg z-20 m-4"
      style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
    >
      <div className="flex p-4 gap-[2rem] items-center">
        <p className="text-sm font-normal">
          Location is not exact?
        </p>
        <button
          className={`px-2 py-2 rounded-lg ${isDrawMode && "bg-pure-blue"} hover:bg-pure-blue group `}
          onClick={() => {
            if(drawTool){
              if(!ref.current){
                map?.addControl(drawTool);
                ref.current = true
              }
              drawTool?.changeMode("draw_polygon");
              setDrawMode(true)
            }

          }}
        >
          <div className="flex gap-2">
            <p
              className={`text-sm font-normal text-black group-hover:text-white ${isDrawMode && "text-white"} `}
            >
              Draw
            </p>
            <Image
              src="/images/draw.svg"
              alt="draw"
              width={18}
              height={18}
              className={`group-hover:filter group-hover:invert ${isDrawMode && "filter invert"} `}
            />
          </div>
        </button>

        <button
          className="px-2 py-2 rounded-lg hover:bg-pure-blue group"
          onClick={() => {
            deletePolygon();
          }}
        >
          <div className="flex gap-2">
            <p className="text-sm font-normal text-black group-hover:text-white">
              Delete
            </p>
            <Image
              src="/images/delete.svg"
              alt="drag-pan"
              width={18}
              height={18}
              className="group-hover:filter group-hover:invert"
            />
          </div>
        </button>
      </div>
    </div>
    {isDrawMode &&(
      <div className="bg-white rounded-lg p-4 w-[410px] z-20 absolute top-28 right-2 ">
      <p className="text-[13px]">
          Please ensure the address entered matches the registered property address to accurately claim this area.
      </p>
     </div>
    )}
    </div>
    
  );
};

export default PolygonTool;