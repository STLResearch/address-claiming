import { useState } from "react";
import { LocationPointIcon, MagnifyingGlassIcon } from "@/Components/Shared/Icons";
import { GiSettingsKnobs } from "react-icons/gi";
import { handleSelectAddress } from "@/utils/addressUtils/addressFunction";

interface RentSearchMobileProps {
  address: string;
  setAddress: (value: string) => void;
  showOptions: boolean;
  addresses: { id: string; place_name: string }[];
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const RentSearchMobile: React.FC<RentSearchMobileProps> = ({
  address,
  setAddress,
  showOptions,
  addresses,
  setFlyToAddress,
  setShowOptions,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="fixed left-0 top-0 z-20 w-full bg-white p-4 text-center shadow-md md:hidden">
      <div className="flex items-center justify-between gap-2">
        Rent
        <div className="flex items-center justify-between overflow-hidden rounded-lg border p-2">
          <input
            autoComplete="off"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            name="searchAirspaces"
            id="searchAirspaces"
            placeholder="Search Airspaces"
            className="min-w-[200px] text-[14px] focus:outline-none"
          />

          <div className="h-4 w-4">
            <MagnifyingGlassIcon />
          </div>
        </div>
        <div onClick={() => setIsFilterOpen(!isFilterOpen)} className="text-gray-300 cursor-not-allowed">
          <GiSettingsKnobs />
        </div>
      </div>
      <div>
        {showOptions && (
          <div className="absolute left-0 top-[55px] mt-2 h-[279px] w-full flex-col overflow-y-scroll rounded-lg rounded-t-[8px] border-t-4 border-t-[#4285F4] bg-white">
            {addresses.map((item) => {
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectAddress(item.place_name, setAddress, setFlyToAddress, setShowOptions)}
                  className="w-full p-4 text-left text-[#222222]"
                  style={{
                    borderBottom: "0.2px solid #DBDBDB",
                  }}
                >
                  <div className="flex items-center">
                    <div className="mr-2 h-6 w-[10%]">
                      <LocationPointIcon />
                    </div>

                    <div className="w-[90%]">{item.place_name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentSearchMobile;
