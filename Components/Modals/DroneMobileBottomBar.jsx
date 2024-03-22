import { RectangleIcon } from "../Icons";
const DroneMobileBottomBar = ({ DroneDataDetailSelected, onActivate }) => {
  console.log(DroneDataDetailSelected, "data");
  return (
    <div
      className="z-[200] h-auto text-black flex justify-center fixed bottom-0 left-0 w-full md:w-[375px] bg-white shadow-xl rounded-t-3xl transition-transform duration-300 ease-out cursor-pointer"
      onClick={onActivate}
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
