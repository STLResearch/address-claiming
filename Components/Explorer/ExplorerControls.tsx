import React from 'react';
import { RadarLocationIcon, RadarLayerIcon, RadarZoomInIcon, RadarZoomOutIcon } from '../Icons';

interface ExplorerControlsProps {
  flyToUserIpAddress: () => void;
  setSatelliteView: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const ExplorerControls: React.FC<ExplorerControlsProps> = ({
  flyToUserIpAddress,
  setSatelliteView,
  handleZoomIn,
  handleZoomOut,
}) => {
  return (
    <div className="flex gap-3">
      <button onClick={flyToUserIpAddress}>
        <RadarLocationIcon />
      </button>
      <button onClick={setSatelliteView}>
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
