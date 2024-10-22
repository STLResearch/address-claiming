import React, { useState } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import FilterTab from "./FilterTab";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { shallowEqual } from "react-redux";
import { setActiveFilters, setPriceRange, setIsTriggerRefresh } from "@/redux/slices/userSlice";

const BuyFilter = () => {
  const { priceRange } = useAppSelector((state) => {
    const { priceRange } = state.userReducer;
    return { priceRange };
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pricePerSqFt, setPricePerSqFt] = useState([0, 0]);
  const dispatch = useAppDispatch();

  const handlePriceRangeChange = (newRange: number[]) => {
    dispatch(setPriceRange(newRange));
  };

  const handlePricePerSqFtChange = (newRange) => {
    setPricePerSqFt(newRange);
  };

  const handleInputChange = (setter: any, index: number, value: number) => {
    const newRange = [...setter];
    newRange[index] = value;
    setter(newRange);
  };

  const { activeFilters } = useAppSelector((state) => {
    const { activeFilters } = state.userReducer;
    return { activeFilters };
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
    dispatch(setIsTriggerRefresh(true));
  };

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <div className="flex h-[54px] h-full w-[102px] items-center justify-center gap-2 rounded-[8px] bg-white/50 p-[10px]">
          Filter
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="relative whitespace-nowrap rounded-[8px] bg-white px-[10px] py-[5px] transition transition-all duration-150 ease-in-out hover:bg-dark-blue hover:text-white"
          >
            {activeFilters > 0 && (
              <div className="absolute -left-[5px] -top-[5px] h-4 w-4 rounded-full bg-dark-blue text-center text-xs text-white">
                {activeFilters}
              </div>
            )}
            <GiSettingsKnobs />
          </button>
        </div>
        <div className="flex h-[54px] w-[283px] items-center justify-between gap-2 rounded-[8px] bg-white/50 p-[10px]">
          <div className="whitespace-nowrap">{"Didn't find location?"}</div>
          <button className="whitespace-nowrap rounded-[8px] bg-white px-[10px] py-[5px] transition transition-all duration-150 ease-in-out hover:bg-dark-blue hover:text-white">
            Request it
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="flex max-w-[298px] flex-col gap-4 rounded-[20px] bg-white p-[20px]">
          <FilterTab
            title="Total Price Range"
            range={priceRange}
            setRange={(value: number[]) => handlePriceRangeChange(value)}
          />
          <button onClick={handleSetActiveFilters} className="w-full rounded-lg bg-dark-blue py-2 text-base text-white">
            Save Filter
          </button>
        </div>
      )}
    </>
  );
};

export default BuyFilter;
