import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { MagnifyingGlassIcon } from "../Shared/Icons";
import { GiSettingsKnobs } from "react-icons/gi";
import { FiPlus } from "react-icons/fi";
import FilterTab from "./FilterTab";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { setActiveFilters, setIsCreateAuctionModalOpen } from "@/redux/slices/userSlice";
import { shallowEqual } from "react-redux";
import { useMobile } from "@/hooks/useMobile";

interface AuctionSearchMobileProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const AuctionSearchMobile: React.FC<AuctionSearchMobileProps> = ({ searchTerm, setSearchTerm }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [pricePerSqFt, setPricePerSqFt] = useState([0, 0]);
  const [searchValue, setSearchValue] = useState("");
  const { isMobile } = useMobile();

  const { activeFilters, isCreateAuctionModalOpen } = useAppSelector((state) => {
    const { activeFilters, isCreateAuctionModalOpen } = state.userReducer;
    return { activeFilters, isCreateAuctionModalOpen };
  }, shallowEqual);

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
  const handleSearchAuctions = async () => {
    setSearchTerm(searchValue);
  };

  if (isMobile) {
    return (
      <div className="fixed left-0 top-0 z-20 w-full bg-white p-4 text-center shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[20px] leading-[30px] text-light-black">Buy</div>
          <div className="flex items-center justify-between overflow-hidden rounded-lg border p-2">
            <input
              placeholder="Search auctions..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? handleSearchAuctions() : "")}
              className="min-w-[200px] text-[14px] focus:outline-none"
            />

            <div className="h-4 w-4" onClick={handleSearchAuctions}>
              <MagnifyingGlassIcon />
            </div>
          </div>
          <div onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <GiSettingsKnobs />
          </div>
          <div onClick={() => dispatch(setIsCreateAuctionModalOpen(true))} className="rounded-lg bg-dark-blue p-2">
            <FiPlus className="text-white" />
          </div>
        </div>

        {isFilterOpen && (
          <div className="flex w-full flex-col gap-4 bg-white p-4">
            <FilterTab
              title="Total Price Range"
              range={priceRange}
              setRange={(value: number[]) => setPriceRange(value)}
            />

            <button
              onClick={handleSetActiveFilters}
              className="w-full rounded-lg bg-dark-blue py-2 text-base text-white"
            >
              Save Filter
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default AuctionSearchMobile;
