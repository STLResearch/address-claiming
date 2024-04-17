import { formatTimeAgoFromMilliseconds } from "@/utils/radarUtils";
import { JsonObject } from "@/types/RemoteIdentifierDrone";

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const ConnectionDetails: React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <p className=" text-[14px]  text-[#4285F4] font-semibold leading-[2rem] mt-2 md:mt-0">
        CONNECTION
      </p>
      <div className="border-t-2 my-4"></div>
      <div className="flex   gap-[12px]  leading-[20px] ">
        <div className="w-[60%] break-words">
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            RSSI{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.connection?.rssi} dBm Beacon
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Started{" "}
            <span className="text-[#222222] overflow-auto">
              {formatTimeAgoFromMilliseconds(
                DroneDataDetailSelected?.remoteData?.connection?.firstSeen
              )}{" "}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Msg{" "}
            <span className="text-[#222222] overflow-auto">
              {parseInt(
                (
                  (DroneDataDetailSelected?.remoteData?.connection?.msgDelta ??
                    0) / 1000
                ).toString()
              )}
              s
            </span>
          </p>
        </div>
        <div className="w-[40%] break-words">
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            MAC{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.connection?.macAddress}
            </span>
          </p>
          <div className="flex text-[#838187] text-[10px] gap-[10px]">
            <pre>Last seen </pre>
            <span className="text-[#222222] overflow-auto">
              {formatTimeAgoFromMilliseconds(
                DroneDataDetailSelected?.remoteData?.connection?.lastSeen
              )}{" "}
            </span>
          </div>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Distance{" "}
            <span className="text-[#222222]">
              {DroneDataDetailSelected?.remoteData?.location?.distance}m
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ConnectionDetails;
