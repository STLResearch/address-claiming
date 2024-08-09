import { AuctionPropertyI, PropertyData } from "@/types";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { convertDate } from "@/utils";

interface AuctionItemProps {
  data: PropertyData | AuctionPropertyI;
  onSelectItem: (item: PropertyData) => void;
  onUpdateItem: (
    propertyId: number | null,
    minSalePrice: number | null,
    endDate: Date | string | null
  ) => void;
  selected: boolean;
  disabled: boolean;
}

const AuctionItem: React.FC<AuctionItemProps> = ({
  data,
  onSelectItem,
  onUpdateItem,
  selected,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minSalePrice, setMinSalePrice] = useState<string>("");

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
    setMinSalePrice(e.target.value);
    onUpdateItem(
      data?.propertyId || null,
      parseFloat(e.target.value) || 0,
      endDate
    );
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onUpdateItem(
      data?.propertyId || null,
      parseFloat(minSalePrice) || 0,
      convertDate(date)
    );
  };

  const now = new Date();
  const maxDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  const isToday = endDate
    ? now.toDateString() === endDate.toDateString()
    : false;
  const minTime = isToday ? now : new Date().setHours(0, 0);

  return (
    <div
      className={`${isOpen ? "" : "hover:bg-black/10"} flex flex-col p-4 shadow-md rounded-[8px] transition duration-150 ease-in-out ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div
        onClick={handleToggleClick}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div>
            <input
              type="checkbox"
              checked={selected}
              onChange={handleCheckboxClick}
              disabled={disabled}
            />
          </div>
          <div>{data.address}</div>
        </div>
        <div className="">{isOpen ? <FiChevronDown /> : <FiChevronUp />}</div>
      </div>
      {isOpen && (
        <div className="p">
          <div>
            <label className="text-sm text-light-grey" htmlFor="minSalePrice">
              Minimum Sale Price
            </label>
            <div className="rounded-[8px] flex items-center border border-light-grey overflow-hidden px-4">
              <span className="pr-1">$</span>
              <input
                className="focus:outline-none h-[49px]"
                value={minSalePrice}
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
              className="rounded-[8px] flex items-center border border-light-grey overflow-hidden px-4 w-full"
            >
              <DatePicker
                id="datetime"
                selected={endDate}
                onChange={handleEndDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM/dd/yyyy HH:mm"
                className="focus:outline-none h-[49px] w-full"
                placeholderText="Select date & time"
                minDate={now}
                maxDate={maxDate} // Set the max date to two weeks from now
                // minTime={minTime as Date}
                // maxTime={null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionItem;
