import { convertToHex } from "@/utils/radarUtils";
const BasicIDDetails = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
        BASIC ID 1
      </h1>
      <div className="border-t-2 my-2"></div>
      <div>
        <div className="flex gap-[1rem] leading-[20px]">
          <div className="w-[60%] gap-[12px] break-words">
            <p className="flex text-[#838187] text-[10px] gap-[10px]">
              Type{" "}
              <span className="text-[#222222]">
                {DroneDataDetailSelected?.remoteData?.identification1?.uaType}
              </span>
            </p>
            <div className="flex text-[#838187] text-[10px] gap-[10px]">
              <pre>UAS ID</pre>
              <span className="text-[#222222] overflow-auto">
                {convertToHex(
                  DroneDataDetailSelected?.remoteData?.identification1?.uasId
                )}
              </span>
            </div>
          </div>
          <div className="w-[40%] break-words">
            <div className="flex text-[#838187] text-[10px] gap-[10px]">
              <pre>ID Type</pre>
              <span className="text-[#222222] overflow-auto">
                {DroneDataDetailSelected?.remoteData?.identification1?.idType}
              </span>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
        BASIC ID 2
      </h1>
      <div className="border-t-2 my-2"></div>
      <div>
        <div className="flex   gap-[12px]   leading-[20px] ">
          <div className="w-[60%] break-words">
            <p className="flex text-[#838187] text-[10px] gap-[10px]">
              Type{" "}
              <span className="text-[#222222] overflow-auto">
                {DroneDataDetailSelected?.remoteData?.identification2?.uaType}
              </span>
            </p>
            <div className="flex text-[#838187] text-[10px] gap-[10px]">
              <pre>UAS ID</pre>
              <span className="text-[#222222] overflow-auto">
                {convertToHex(
                  DroneDataDetailSelected?.remoteData?.identification2?.uasId
                )}
              </span>
            </div>
          </div>
          <div className="w-[40%] break-words">
            <div className="flex text-[#838187] text-[10px] gap-[10px] ">
              <pre>ID Type</pre>
              <span className="text-[#222222] overflow-auto">
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
