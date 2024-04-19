import { convertToHex } from "@/utils/radarUtils";
import {JsonObject}  from '@/types/RemoteIdentifierDrone'

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const BasicIDDetails : React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-sml font-semibold text-corporate-blue mt-3 ">
        BASIC ID 1
      </h1>
      <div className="border-t-2 my-2"></div>
      <div>
        <div className="flex gap-4 leading-5">
          <div className="w-[60%] gap-3 break-words">
            <p className="flex text-slate-gray-text text-xs gap-2.5">
              Type{" "}
              <span className="text-light-black">
                {DroneDataDetailSelected?.remoteData?.identification1?.uaType}
              </span>
            </p>
            <div className="flex text-slate-gray-text text-xs gap-2.5">
              <pre>UAS ID</pre>
              <span className="text-light-black overflow-auto">
                {convertToHex(
                  DroneDataDetailSelected?.remoteData?.identification1?.uasId
                )}
              </span>
            </div>
          </div>
          <div className="w-[40%] break-words">
            <div className="flex text-slate-gray-text text-xs gap-2.5">
              <pre>ID Type</pre>
              <span className="text-light-black overflow-auto">
                {DroneDataDetailSelected?.remoteData?.identification1?.idType}
              </span>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-sml font-semibold text-corporate-blue mt-3 ">
        BASIC ID 2
      </h1>
      <div className="border-t-2 my-2"></div>
      <div>
        <div className="flex   gap-3   leading-5 ">
          <div className="w-[60%] break-words">
            <p className="flex text-slate-gray-text text-xs gap-2.5">
              Type{" "}
              <span className="text-light-black overflow-auto">
                {DroneDataDetailSelected?.remoteData?.identification2?.uaType}
              </span>
            </p>
            <div className="flex text-slate-gray-text text-xs gap-2.5">
              <pre>UAS ID</pre>
              <span className="text-light-black overflow-auto">
                {convertToHex(
                  DroneDataDetailSelected?.remoteData?.identification2?.uasId
                )}
              </span>
            </div>
          </div>
          <div className="w-[40%] break-words">
            <div className="flex text-slate-gray-text text-xs gap-2.5 ">
              <pre>ID Type</pre>
              <span className="text-light-black overflow-auto">
                {DroneDataDetailSelected?.remoteData?.identification2?.idType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicIDDetails;
