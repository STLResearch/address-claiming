import React from 'react';
import MobileSearchInput from './MobileSearchInput';
import { ArrowLeftIcon } from '../Icons';

interface MobileExplorerProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: { id: string; place_name: string; }[]; 
  showOptions: boolean;
  handleSelectAddress: (address: string) => void;
  onGoBack: () => void;
}

const MobileExplorer: React.FC<MobileExplorerProps> = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
  onGoBack,
}) => {
  return (
    <div className="z-[40] flex items-center gap-[15px] bg-white px-[21px] py-[19px]">
      <div onClick={onGoBack} className="flex h-6 w-6 items-center justify-center">
        <ArrowLeftIcon />
      </div>
      <MobileSearchInput
        address={address}
        setAddress={setAddress}
        addresses={addresses}
        showOptions={showOptions}
        handleSelectAddress={handleSelectAddress}
      />
    </div>
  );
};

export default MobileExplorer;
