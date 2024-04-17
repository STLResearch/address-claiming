import { formatAccuracy } from "@/utils/radarUtils";
import { convertToTimestampDate } from "@/utils/radarUtils";
import { JsonObject } from "@/types/RemoteIdentifierDrone";

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const LocationDetails: React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
        LOCATION
      </h1>
      <div className="border-t-2 my-2"></div>
      <div className="flex   gap-[12px]    leading-[20px] ">
        <div className="w-[60%] break-words">
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Latitude{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.latitude}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Altitude Press{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.altitudePressure}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Direction{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.direction}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Horizontal Speed{" "}
            <span className="text-[#222222] overflow-auto">
              {parseFloat(
                (
                  DroneDataDetailSelected?.remoteData?.location
                    ?.speedHorizontal ?? 0 / 100
                ).toString()
              ).toFixed(2)}
              m/s
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Height{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.height}m
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Horizontal Accuracy{" "}
            <span className="text-[#222222] overflow-auto">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location
                  ?.horizontalAccuracy
              )}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Baro Acc.{" "}
            <span className="text-[#222222] overflow-auto">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location?.baroAccuracy
              )}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Time Acc.{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.timeAccuracy}s
            </span>
          </p>
        </div>
        <div className="w-[40%] break-words">
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            {" "}
            Longitude{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.longitude}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Altitude Geod{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.altitudeGeodetic}m
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Status{" "}
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.status}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Vertical Speed{" "}
            <span className="text-[#222222] overflow-auto">
              {parseFloat(
                (
                  DroneDataDetailSelected?.remoteData?.location
                    ?.speedVertical ?? 0 / 100
                ).toString()
              ).toFixed(2)}
              m/s
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Height Over{" "}
            <span className="text-[#221919] overflow-auto">Ground</span>
          </p>
          <div className="flex text-[#838187] text-[10px] gap-[6px]">
            Vertical Accuracy
            <div className="text-[#222222] ">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location?.verticalAccuracy
              )}
            </div>
          </div>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Speed Acc.
            <span className="text-[#222222] overflow-auto">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location?.speedAccuracy
              )}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Timestamp
            <span className="text-[#222222] overflow-auto">
              {convertToTimestampDate(
                DroneDataDetailSelected?.remoteData?.location?.locationTimestamp
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LocationDetails;
