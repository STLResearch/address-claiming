import React, { useRef } from 'react';
import { RectangleIcon } from '../Icons';
import { JsonObject } from "@/types/RemoteIdentifierDrone";

interface DroneMobileBottomBarProps {
  DroneDataDetailSelected: JsonObject | null; 
  onActivate: () => void;
}

const DroneMobileBottomBar: React.FC<DroneMobileBottomBarProps> = ({ DroneDataDetailSelected, onActivate }) => {
  const bottomBarRef = useRef<HTMLDivElement>(null);
  let startY = 0;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startY = event.touches[0].clientY;
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (event: TouchEvent) => {
    const diffY = startY - event.touches[0].clientY;
    if (diffY > 50) {
      onActivate();
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={bottomBarRef}
      className="z-[200] h-auto text-black flex justify-center fixed bottom-0 left-0 w-full md:w-[375px] bg-white shadow-xl rounded-t-3xl transition-transform duration-300 ease-out cursor-pointer"
      onClick={onActivate}
      onTouchStart={handleTouchStart}
    >
      <div>
        <div className=" w-[90%] mt-[13px] flex justify-center  items-center  md:hidden">
          <RectangleIcon />
        </div>
        <div className="mt-[21px] mb-5">{DroneDataDetailSelected?.id}</div>
      </div>
    </div>
  );
};

export default DroneMobileBottomBar;
