import React from 'react';
import Image from 'next/image';


const PolygonTool = () => {
  const isDrawMode = true;
  let drawTool: any;

  const deletePolygon = () => {
    const selectedFeatures = drawTool.getSelectedIds();
    if (selectedFeatures.length > 0) {
      drawTool.delete(selectedFeatures);
    }
  };

  return (
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
            drawTool?.changeMode("draw_polygon");
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
  );
};

export default PolygonTool;
