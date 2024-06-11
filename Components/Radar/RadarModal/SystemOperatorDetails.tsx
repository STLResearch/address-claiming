import { JsonObject } from '@/types';

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const SystemOperatorDetails : React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-sml font-semibold text-corporate-blue mt-3 ">
        SYSTEM OPERATOR
      </h1>
      <div className="border-t-2 my-2"></div>
      <div className="flex gap-3 leading-5 ">
        <div className="w-[60%] break-words">
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Location Type{" "}
            <span className="text-light-black overflow-auto">
              {
                DroneDataDetailSelected?.remoteData?.system
                  ?.operatorLocationType
              }
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Latitude
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.operatorLatitude}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Area Count
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaCount}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Area Celling
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaCeiling}m
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Classification
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.classificationType}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Category
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.category}
            </span>
          </p>
        </div>
        <div className="w-[40%] break-words">
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Altitude
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.operatorAltitudeGeo}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Longitude
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.operatorLongitude}
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Area radius
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaRadius}m
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Area floor
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaFloor} m
            </span>
          </p>
          <p className="flex text-slate-gray-text text-xs gap-2.5">
            Class
            <span className="text-light-black overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.classValue}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SystemOperatorDetails;