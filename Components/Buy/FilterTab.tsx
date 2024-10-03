import React from "react";
import ReactSlider from "react-slider";

interface FilterTabProps {
  title: string;
  range: number[];
  setRange: (value: number[]) => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ title, range, setRange }) => {
  const handleInputChange = (setter: any, index: number, value: number) => {
    const newRange = [...range];
    newRange[index] = value;
    setter(newRange);
  };

  return (
    <div className="flex flex-col gap-4">
      <h4>{title}</h4>
      <div>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          value={range}
          onChange={setRange}
          pearling
          minDistance={10}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-light-grey">Minimum</div>
          <div>
            <input
              type="text"
              value={range[0] > 0 ? range[0].toString() : ""}
              onChange={(e) => handleInputChange(setRange, 0, +e.target.value)}
              className="max-w-[94px] rounded-[8px] border border-light-grey py-2 text-center focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-4 h-[2px] w-4 bg-light-grey"></div>
        <div>
          <div className="text-sm text-light-grey">Maximum</div>
          <div>
            <input
              type="number"
              value={range[1] > 0 ? range[1].toString() : ""}
              onChange={(e) => handleInputChange(setRange, 1, +e.target.value)}
              className="max-w-[94px] rounded-[8px] border border-light-grey py-2 text-center focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTab;
