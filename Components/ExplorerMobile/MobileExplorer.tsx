import React from 'react';
import MobileSearchInput from './MobileSearchInput';
import { ArrowLeftIcon } from '../Icons';

interface MobileExplorerProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: { id: string; place_name: string; }[]; 
  showOptions: boolean;
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  onGoBack: () => void;
}

const MobileExplorer: React.FC<MobileExplorerProps> = ({
  address,
  setAddress,
  addresses,
  showOptions,
  setFlyToAddress,
  setShowOptions,
  onGoBack,
}) => {
  return (
    <div className="z-40 flex items-center gap-md bg-white px-5 py-5">
      <div onClick={onGoBack} className="flex h-6 w-6 items-center justify-center">
        <ArrowLeftIcon />
      </div>
      <MobileSearchInput
        address={address}
        setAddress={setAddress}
        addresses={addresses}
        showOptions={showOptions}
        setFlyToAddress={setFlyToAddress}
        setShowOptions={setShowOptions}
      />
    </div>
  );
};

export default MobileExplorer;
