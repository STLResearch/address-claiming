import React from 'react';
import { MagnifyingGlassIcon } from '../Icons';

interface MobileSearchInputProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  addresses: { id: string; place_name: string }[]; 
  showOptions: boolean;
  handleSelectAddress: (address: string) => void;
}

const MobileSearchInput: React.FC<MobileSearchInputProps> = ({
  address,
  setAddress,
  addresses,
  showOptions,
  handleSelectAddress,
}) => {
  return (
    <div className="relative w-full rounded-lg bg-white px-[22px] py-4 border border-light-grey" >
      <input
        autoComplete="off"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        name="searchLocation"
        id="searchLocation"
        placeholder="Search Location"
        className="w-full pr-5 outline-none"
      />
      <div className="absolute right-[22px] top-1/2 h-[17px] w-[17px] -translate-y-1/2">
        <MagnifyingGlassIcon />
      </div>
      {showOptions && (
        <div className="absolute left-0 top-[55px] w-full flex-col bg-white">
          {addresses.map((item) => (
            <div
              key={item.id}
              data-value={item.place_name}
              onClick={() => handleSelectAddress(item.place_name)}
              className="w-full p-5 text-left text-light-black border-t-[0.2px] border-light-black"
            >
              {item.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSearchInput;
