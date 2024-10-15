import React, { useState } from "react";
import Link from "next/link";
import PlanningPermissionCheckbox from "./PlanningPermissionCheckbox";

const ZoningPermission = ({ data, setData }) => {
  return (
    <>
      <p className="text-[#838187] text-[14px]">
        I want my airspace to be available for rent
      </p>
      <div className="flex items-center gap-[7px] text-[#87878D] text-[14px] my-6">
        <PlanningPermissionCheckbox
          label="Yes"
          checked={data.rent}
          onChange={() => setData((prev) => ({ ...prev, rent: true }))}
        />
        <PlanningPermissionCheckbox
          label="No"
          checked={data.rent === false}
          onChange={() => setData((prev) => ({ ...prev, rent: false }))}
        />
      </div>
      <Link
        target="_blank"
        href={"https://skytrade.tawk.help"}
        className="text-[#0653EA] text-[14px] font-normal cursor-pointer leading-[1.5rem]"
      >
        Learn more about rentals in our FAQ.
      </Link>
    </>
  );
};

export default ZoningPermission;
