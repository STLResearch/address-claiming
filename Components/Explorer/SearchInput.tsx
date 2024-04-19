import React from 'react';
import { MagnifyingGlassIcon } from '../Icons';

interface SearchInputProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  showOptions: boolean;
  addresses: { id: string; place_name: string }[];
  handleSelectAddress: (address: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  address,
  setAddress,
  showOptions,
  addresses,
  handleSelectAddress,
}) => {
  return (
    <div className="relative w-full flex items-center rounded-lg bg-white px-2.5 py-2.5 border border-light-grey/30" >
      <input
        autoComplete="off"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        name="searchLocation"
        id="searchLocation"
        placeholder="Search location"
        className="w-full pr-5 outline-none"
      />
      <div className="h-[17px] w-[17px]">
        <MagnifyingGlassIcon />
      </div>
      {showOptions && (
        <div className="absolute left-0 top-14 w-full flex-col bg-white">
          {addresses.map((item) => (
            <div
              key={item?.id}
              data-value={item?.place_name}
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

export default SearchInput;
