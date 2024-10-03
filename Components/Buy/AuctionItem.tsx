import React, { useState } from "react";
import { AuctionPropertyI, PropertyData } from "@/types";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import DatePicker from "react-datepicker";

import { convertDate } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setEndDate, setMinSalePrice } from "@/redux/slices/userSlice";

interface AuctionItemProps {
  data: PropertyData | AuctionPropertyI;
  onSelectItem: (item: PropertyData) => void;
  onUpdateItem: (
    propertyId: string | number | null,
    minSalePrice: number | null,
    endDate: Date | string | null
  ) => void;
  selected: boolean;
  disabled: boolean;
}

const AuctionItem: React.FC<AuctionItemProps> = ({ data, onSelectItem, onUpdateItem, selected, disabled }) => {
  const { airspaceList, isTriggerRefresh, userSolBalance, userUSDWalletBalance, endDate, minSalePrice } =
    useAppSelector((state) => {
      const { airspaceList, isTriggerRefresh, userSolBalance, userUSDWalletBalance, endDate, minSalePrice } =
        state.userReducer;
      return {
        airspaceList,
        isTriggerRefresh,
        userSolBalance,
        userUSDWalletBalance,
        endDate,
        minSalePrice,
      };
    });

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectItem(data as PropertyData);
    event.stopPropagation();
  };

  const handleToggleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName !== "INPUT") {
      setIsOpen(!isOpen);
    }
  };

  const handleMinSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setMinSalePrice(e.target.value));
    onUpdateItem(data?.propertyId || null, parseFloat(e.target.value) || 0, convertDate(endDate));
  };

  const handleEndDateChange = (date: Date | null) => {
    const dateResult = convertDate(date);

    dispatch(setEndDate(date));

    onUpdateItem(data?.propertyId || null, minSalePrice || 0, convertDate(date));
  };

  const now = new Date();
  const maxDate = new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000);

  const isToday = endDate ? now.toLocaleString() === endDate.toLocaleString() : false;
  const minTime = isToday ? now : new Date().setHours(0, 0);

  return (
    <div
      className={`${isOpen ? "" : "hover:bg-black/10"} flex flex-col rounded-[8px] p-4 shadow-md transition duration-150 ease-in-out ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <div onClick={handleToggleClick} className="flex cursor-pointer items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <input type="checkbox" checked={selected} onChange={handleCheckboxClick} />
          </div>
          <div>{data?.address || ""}</div>
        </div>
        <div className="">
          {isOpen ?
            <FiChevronDown />
          : <FiChevronUp />}
        </div>
      </div>
      {isOpen && (
        <div className="p">
          <div>
            <label className="text-sm text-light-grey" htmlFor="minSalePrice">
              Minimum Sale Price
            </label>
            <div className="flex items-center overflow-hidden rounded-[8px] border border-light-grey px-4">
              <span className="pr-1">$</span>
              <input
                className="h-[49px] focus:outline-none"
                value={minSalePrice as number}
                onChange={handleMinSalePriceChange}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="text-sm text-light-grey" htmlFor="endDate">
              Auction End Date
            </label>
            <div
              id="datetime"
              className="flex w-full items-center overflow-hidden rounded-[8px] border border-light-grey px-4"
            >
              <DatePicker
                id="datetime"
                //@ts-ignore
                selected={endDate}
                onChange={handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM/dd/yyyy HH:mm"
                className="h-[49px] w-full focus:outline-none"
                placeholderText="Select date & time"
                minDate={now}
                maxDate={maxDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionItem;
