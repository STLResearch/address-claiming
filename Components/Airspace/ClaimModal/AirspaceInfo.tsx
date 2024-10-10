import React from "react";
import { LocationPointIcon } from "@/Components/Icons";
import { PropertyData } from "@/types";

interface AirspaceInfoProps {
  address: string;
  title: string;
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const AirspaceInfo: React.FC<AirspaceInfoProps> = ({ address, title, setData }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, title: e.target.value }));
  };

  return (
    <>
      <div className="flex items-center gap-[10px] rounded-lg border border-[#4285F4] px-[22px] py-4">
        <div className="h-6 w-6">
          <LocationPointIcon />
        </div>
        <p className="flex-1 text-[14px] font-normal text-[#222222]">{address}</p>
      </div>
      <div className="mt-3 flex flex-col gap-[5px] md:mt-4">
        <label htmlFor="title">
          Name of airspace<span className="text-[#E04F64]">*</span>
        </label>
        <input
          value={title}
          onChange={handleTitleChange}
          className="mt-0.5 rounded-lg px-[22px] py-[16px] text-[14px] text-[#222222] outline-none md:mt-1"
          style={{ border: "1px solid #87878D" }}
          type="text"
          name="title"
          id="title"
          autoComplete="off"
        />
      </div>
    </>
  );
};

export default AirspaceInfo;
