const SystemOperatorDetails = ({ DroneDataDetailSelected }) => {
  return (
    <div>
      <h1 className="text-[14px] font-semibold text-[#4285F4] mt-3 ">
        SYSTEM OPERATOR
      </h1>
      <div className="border-t-2 my-2"></div>
      <div className="flex   gap-[12px]    leading-[20px] ">
        <div className="w-[60%] break-words">
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Location Type{" "}
            <span className="text-[#222222] overflow-auto">
              {
                DroneDataDetailSelected?.remoteData?.system
                  ?.operatorLocationType
              }
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Latitude
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.operatorLatitude}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Area Count
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaCount}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Area Celling
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaCeiling}m
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Classification
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.classificationType}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Category
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.category}
            </span>
          </p>
        </div>
        <div className="w-[40%] break-words">
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Altitude
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.operatorAltitudeGeo}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Longitude
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.operatorLongitude}
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Area radius
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaRadius}m
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Area floor
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.areaFloor} m
            </span>
          </p>
          <p className="flex text-[#838187] text-[10px] gap-[10px]">
            Class
            <span className="text-[#222222] overflow-auto">
              {DroneDataDetailSelected?.remoteData?.system?.classValue}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SystemOperatorDetails;
