import { convertToHex } from "@/utils/radarUtils";
const OperatorIDDetails = ({ DroneDataDetailSelected }) => {
  return (
      <div>
        <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
          OPERATOR ID
        </h1>
        <div className="border-t-2 my-2"></div>
        <div className="flex  gap-[12px]    leading-[20px] mb-4">
          <div className="w-[60%] break-words">
            <div className="flex text-[#838187] text-[10px] gap-[10px]">
              <pre>Operation IF</pre>
              <span className="text-[#222222] overflow-auto">
                {convertToHex(
                  DroneDataDetailSelected?.remoteData?.operatorId?.operatorId
                )}
              </span>
            </div>
          </div>
          <div className="w-[40%] break-words">
            <p className="flex text-[#838187] text-[10px] gap-[10px] mb-[43px] md:mb-0">
              Type{" "}
              <span className="text-[#222222] overflow-auto">
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
