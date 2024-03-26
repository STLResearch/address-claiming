import { RectangleIcon } from "../Icons";
import { useRef } from "react";

const DroneMobileBottomBar = ({ DroneDataDetailSelected, onActivate }) => {
  const bottomBarRef = useRef(null);
  let startY = 0;

  const handleTouchStart = (event) => {
    startY = event.touches[0].clientY;
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (event) => {
    const diffY = startY - event.touches[0].clientY;
    if (diffY > 50) {
      onActivate();
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }
  };

  const handleTouchEnd = () => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
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
        <div className="mt-[21px] mb-[20px]">{DroneDataDetailSelected?.name}</div>
      </div>
    </div>
  );
};

export default DroneMobileBottomBar;
