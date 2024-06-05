import React from "react";
import { LocationPointIcon } from "@/Components/Icons";
import { PropertyData } from "@/types";

interface AirspaceInfoProps {
  address:string;
  title:string
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const AirspaceInfo: React.FC<AirspaceInfoProps> = ({ address,title, setData }) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, title: e.target.value }));
  };

  return (
    <>
      <div className="flex items-center gap-[10px] py-4 px-[22px] rounded-lg border border-[#4285F4]" >
        <div className="w-6 h-6">
          <LocationPointIcon />
        </div>
        <p className="font-normal text-[#222222] text-[14px] flex-1">{address}</p>
      </div>
      <div className="flex flex-col gap-[5px] mt-3 md:mt-4">
        <label htmlFor="title">
          Name of airspace<span className="text-[#E04F64]">*</span>
        </label>
        <input
          value={title}
          onChange={handleTitleChange}
          className="py-[16px] px-[22px] rounded-lg text-[14px] outline-none text-[#222222] mt-0.5 md:mt-1"
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
