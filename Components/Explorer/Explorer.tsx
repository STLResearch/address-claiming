import React from 'react';
import SearchInput from './SearchInput';
import ExplorerControls from './ExplorerControls';

interface ExplorerProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: { id: string; place_name: string; }[];
  showOptions: boolean;
  handleSelectAddress: (address: string) => void;
  flyToUserIpAddress: () => void;
  setSatelliteView: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

const Explorer: React.FC<ExplorerProps> = ({
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
    <div className="absolute right-0 z-20 rounded-lg w-1/2 h-[10%] mt-4">
      <div className="w-full flex justify-end p-2">
        <div
          className="flex p-4 justify-center w-[70%] h-[10%] rounded-lg gap-2.5 z-20 bg-semi-transparent-white"
          style={{ boxShadow: '0px 12px 34px -10px #3A4DE926' }}
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
