import { useState, useEffect, useMemo } from "react";
import { IoArrowBack } from "react-icons/io5";
import { MagnifyingGlassIcon } from "../Shared/Icons";
import { GiSettingsKnobs } from "react-icons/gi";
import { FiPlus } from "react-icons/fi";
import FilterTab from "./FilterTab";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import {
  setActiveFilters,
  setIsCreateAuctionModalOpen,
} from "@/redux/slices/userSlice";
import debounce from 'debounce';
import { shallowEqual } from "react-redux";

interface AuctionSearchMobileProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const AuctionSearchMobile: React.FC<AuctionSearchMobileProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [pricePerSqFt, setPricePerSqFt] = useState([0, 0]);
  const [searchValue, setSearchValue] = useState("");

  const { activeFilters, isCreateAuctionModalOpen } = useAppSelector(
    (state) => {
      const { activeFilters, isCreateAuctionModalOpen } = state.userReducer;
      return { activeFilters, isCreateAuctionModalOpen };
    },
    shallowEqual
  );

  const calculateActiveFilters = () => {
    let activeFilters = 0;
    if (priceRange[0] > 0 || priceRange[1] > 0) activeFilters++;
    if (pricePerSqFt[0] > 0 || pricePerSqFt[1] > 0) activeFilters++;
    return activeFilters;
  };

  const handleSetActiveFilters = () => {
    const activeFilters = calculateActiveFilters();
    dispatch(setActiveFilters(activeFilters));
  };

  const handleSearchAuctions = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const debounceLoadData = useMemo(() => debounce(handleSearchAuctions,3000), []);

  useEffect(() => {
    const searchElement = document.getElementById('search_auctions');
    
    if (searchElement) {
      const handleInput = (event) => debounceLoadData(event.target.value);
      searchElement.addEventListener('input', handleInput);
      return () => {
        searchElement.removeEventListener('input', handleInput);
      };
    }
  }, [debounceLoadData]);
  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-20 bg-white p-4 shadow-md text-center">
      <div className="flex items-center justify-between gap-2">
        <div onClick={() => router.push("/marketplace")}>
          <IoArrowBack />
        </div>
        <div className="flex justify-between items-center border rounded-lg overflow-hidden p-2">
          <input
            id="search_auctions"
            placeholder="Search auctions..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="focus:outline-none min-w-[200px] text-[14px]"
          />

          <div className="w-4 h-4" >
            <MagnifyingGlassIcon />
          </div>
        </div>
        <div onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <GiSettingsKnobs />
        </div>
        <div
          onClick={() => dispatch(setIsCreateAuctionModalOpen(true))}
          className="p-2 bg-dark-blue rounded-lg"
        >
          <FiPlus className="text-white" />
        </div>
      </div>

      {isFilterOpen && (
        <div className="flex flex-col bg-white p-4 gap-4 w-full">
          <FilterTab
            title="Total Price Range"
            range={priceRange}
            setRange={(value: number[]) => setPriceRange(value)}
          />
          {/* <FilterTab
            title="Price Per Square Foot"
            range={pricePerSqFt}
            setRange={(value: number[]) => setPricePerSqFt(value)}
          /> */}
          <button
            onClick={handleSetActiveFilters}
            className="text-base bg-dark-blue py-2 w-full text-white rounded-lg"
          >
            Save Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionSearchMobile;
