import { convertToHex } from "@/utils/radarUtils";
import {JsonObject}  from '@/types/RemoteIdentifierDrone'

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const OperatorIDDetails : React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
      <div>
        <h1 className="text-sml font-semibold text-corporate-blue mt-3 ">
          OPERATOR ID
        </h1>
        <div className="border-t-2 my-2"></div>
        <div className="flex gap-3 leading-5 mb-4">
          <div className="w-[60%] break-words">
            <div className="flex text-slate-gray-text text-xs gap-2.5">
              <pre>Operation IF</pre>
              <span className="text-light-black overflow-auto">
                {convertToHex(
                  DroneDataDetailSelected?.remoteData?.operatorId?.operatorId
                )}
              </span>
            </div>
          </div>
          <div className="w-[40%] break-words">
            <p className="flex text-slate-gray-text text-xs gap-2.5 mb-[43px] md:mb-0">
              Type{" "}
              <span className="text-light-black overflow-auto">
                {
                  DroneDataDetailSelected?.remoteData?.operatorId
                    ?.operatorIdType
                }
              </span>
            </p>
          </div>
        </div>
      </div>
  );
};
export default OperatorIDDetails;
