import { formatTimeAgoFromMilliseconds } from "@/utils/RadarModalDetailFunctions/stringUtils";
import { JsonObject } from "@/types";
interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const ConnectionDetails: React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <p className=" text-sml  text-corporate-blue font-semibold leading-8 mt-2 md:mt-0">
        CONNECTION
      </p>
      <div className="border-t-2 my-4"></div>
      <div className="flex gap-3 leading-5 ">
        <div className="w-[60%] break-words">
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            RSSI{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.connection?.rssi} dBm Beacon
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Started{" "}
            <span className="text-light-black overflow-auto">
              {formatTimeAgoFromMilliseconds(
                DroneDataDetailSelected?.remoteData?.connection?.firstSeen
              )}{" "}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Msg{" "}
            <span className="text-light-black overflow-auto">
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
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            MAC{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.connection?.macAddress}
            </span>
          </p>
          <div className="flex text-slate-gray-text text-xs gap-2.5">
            <pre>Last seen </pre>
            <span className="text-light-black overflow-auto">
              {formatTimeAgoFromMilliseconds(
                DroneDataDetailSelected?.remoteData?.connection?.lastSeen
              )}{" "}
            </span>
          </div>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Distance{" "}
            <span className="text-light-black">
              {DroneDataDetailSelected?.remoteData?.location?.distance}m
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ConnectionDetails;