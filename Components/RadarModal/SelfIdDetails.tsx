import {JsonObject}  from '@/types/RemoteIdentifierDrone'

interface Props {
  DroneDataDetailSelected: JsonObject | null;
}
const SelfIDDetails : React.FC<Props> = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-sml font-semibold text-corporate-blue mt-3 ">
        SELF ID
      </h1>
      <div className="border-t-2 my-2"></div>
      <div>
        <div className="flex gap-3 leading-5">
          <div className="w-[60%] break-words">
            <p className="flex text-slate-gray-text text-xs gap-2.5">
              Operation{" "}
              <span className="text-light-black overflow-auto">
                {DroneDataDetailSelected?.id}
              </span>
            </p>
          </div>
          <div className="w-[40%] break-words">
            <p className="flex text-slate-gray-text text-xs gap-2.5">
              Type{" "}
              <span className="text-light-black overflow-auto">
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
