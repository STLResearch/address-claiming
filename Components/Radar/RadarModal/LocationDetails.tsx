import { formatAccuracy } from "@/utils/RadarModalDetailFunctions/accuracyUtils";
import { convertToTimestampDate } from "@/utils/RadarModalDetailFunctions/conversionUtils";
import { JsonObject } from "@/types";

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const LocationDetails: React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-sml font-semibold text-corporate-blue mt-3 ">
        LOCATION
      </h1>
      <div className="border-t-2 my-2"></div>
      <div className="flex gap-3 leading-5">
        <div className="w-[60%] break-words">
          <p className="flex text-slate-gray-text text-xs">
            Latitude{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.latitude}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Altitude Press{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.altitudePressure}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Direction{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.direction}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Horizontal Speed{" "}
            <span className="text-light-black overflow-auto">
              {parseFloat(
                (
                  DroneDataDetailSelected?.remoteData?.location
                    ?.speedHorizontal ?? 0 / 100
                ).toString()
              ).toFixed(2)}
              m/s
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Height{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.height}m
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Horizontal Accuracy{" "}
            <span className="text-light-black overflow-auto">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location
                  ?.horizontalAccuracy
              )}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Baro Acc.{" "}
            <span className="text-light-black overflow-auto">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location?.baroAccuracy
              )}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Time Acc.{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.timeAccuracy}s
            </span>
          </p>
        </div>
        <div className="w-[40%] break-words">
          <p className="flex text-slate-gray-text text-xs">
            {" "}
            Longitude{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.longitude}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Altitude Geod{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.altitudeGeodetic}m
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Status{" "}
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.location?.status}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Vertical Speed{" "}
            <span className="text-light-black overflow-auto">
              {parseFloat(
                (
                  DroneDataDetailSelected?.remoteData?.location
                    ?.speedVertical ?? 0 / 100
                ).toString()
              ).toFixed(2)}
              m/s
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Height Over{" "}
            <span className="text-light-black overflow-auto">Ground</span>
          </p>
          <div className="flex text-slate-gray-text text-xs">
            Vertical Accuracy
            <div className="text-light-black ">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location?.verticalAccuracy
              )}
            </div>
          </div>
          <p className="flex text-slate-gray-text text-xs">
            Speed Acc.
            <span className="text-light-black overflow-auto">
              {formatAccuracy(
                DroneDataDetailSelected?.remoteData?.location?.speedAccuracy
              )}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs">
            Timestamp
            <span className="text-light-black overflow-auto">
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