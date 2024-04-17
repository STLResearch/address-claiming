import {JsonObject}  from '@/types/RemoteIdentifierDrone'

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const SelfIDDetails : React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
        SELF ID
      </h1>
      <div className="border-t-2 my-2"></div>
      <div>
        <div className="flex  gap-[12px]  leading-[20px]">
          <div className="w-[60%] break-words">
            <p className="flex text-[#838187] text-[10px] gap-[10px]">
              Operation{" "}
              <span className="text-[#222222] overflow-auto">
                {DroneDataDetailSelected?.id}
              </span>
            </p>
          </div>
          <div className="w-[40%] break-words">
            <p className="flex text-[#838187] text-[10px] gap-[10px]">
              Type{" "}
              <span className="text-[#222222] overflow-auto">
                {DroneDataDetailSelected?.remoteData?.selfId?.descriptionType}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelfIDDetails;
