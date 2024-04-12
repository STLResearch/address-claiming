import { RadarLocationIcon,RadarLayerIcon,RadarZoomInIcon,RadarZoomOutIcon } from "../Icons";
const ExplorerControls = ({ flyToUserIpAddress, setSatelliteView, handleZoomIn, handleZoomOut }) => {
    return (
      <div className="flex gap-3">
        <button onClick={() => flyToUserIpAddress(map)}>
          <RadarLocationIcon />
        </button>
        <button onClick={() => setSatelliteView()}>
          <RadarLayerIcon />
        </button>
        <button onClick={handleZoomIn}>
          <RadarZoomInIcon />
        </button>
        <button onClick={handleZoomOut}>
          <RadarZoomOutIcon />
        </button>
      </div>
    );
  };
export default ExplorerControls;