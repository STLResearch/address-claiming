import { AuctionPropertyI } from "@/types";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface AuctionItemProps {
  data: AuctionPropertyI;
}

const AuctionItem: React.FC<AuctionItemProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className={`${isOpen ? "" : "hover:bg-black/10"} flex flex-col p-4 shadow-md rounded-[8px] transition duration-150 ease-in-out`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div>
            <input type="checkbox" onClick={handleCheckboxClick} />
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
              <input className="focus:outline-none h-[49px]" />
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
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MM/dd/yyyy HH:mm"
                className="focus:outline-none h-[49px] w-full"
                placeholderText="Select date & time"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionItem;
