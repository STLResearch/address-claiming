import { DroneradarIcon, ChevronLeftIcon } from "../Icons";
import { JsonObject } from "@/types/RemoteIdentifierDrone";

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}

const DroneIdDetail: React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div className="flex items-center md:justify-center mt-2 md:mt-0">
      <div className="w-[20%] md:hidden">
        <ChevronLeftIcon />
      </div>
      <div className="w-[60%] break-words text-center flex gap-[10px] justify-center items-center">
        <DroneradarIcon />
        <h1 className="text-[20px] font-[500] overflow-auto">
          {DroneDataDetailSelected?.id}
        </h1>
      </div>
    </div>
  );
};

export default DroneIdDetail;
