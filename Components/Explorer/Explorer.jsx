import SearchInput from "./SearchInput";
import ExplorerControls from "./ExplorerControls";
const Explorer = ({
    address,
    setAddress,
    addresses,
    showOptions,
    handleSelectAddress,
    flyToUserIpAddress,
    setSatelliteView,
    handleZoomIn,
    handleZoomOut,
  }) => {
    return (
      <div className="absolute  right-0 z-20 rounded-[8px]  w-[50%] h-[10%] mt-4">
        <div className="w-full flex justify-end p-2">
          <div
            className="flex p-4  justify-center w-[70%] h-[10%]  rounded-[10px]   gap-[15px] z-20 bg-[#FFFFFFCC] "
            style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
          >
            <SearchInput
              address={address}
              setAddress={setAddress}
              showOptions={showOptions}
              addresses={addresses}
              handleSelectAddress={handleSelectAddress}
            />
            <ExplorerControls
              flyToUserIpAddress={flyToUserIpAddress}
              setSatelliteView={setSatelliteView}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
            />
          </div>
        </div>
      </div>
    );
  };
  export default Explorer;