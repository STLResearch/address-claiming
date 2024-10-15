import React from "react";
import PlanningPermissionCheckbox from "./PlanningPermissionCheckbox";
import { PropertyData } from "@/types";

interface PlanningPermissionProps {
  data: PropertyData;
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const PlanningPermission: React.FC<PlanningPermissionProps> = ({
  data,
  setData,
}) => {
  return (
    <div className="mt-4">
      <p className="text-[16px] md:text-[14px] font-normal text-[#838187]">
        Do you currently have zoning or planning permission to develop above
        your land or property?{" "}
        <span className="italic text-[12px] md:text-[10px]">
          (Your answer won&apos;t affect your claim)
          <span className="text-[#E04F64]">*</span>
        </span>{" "}
      </p>
      <div className="flex items-center gap-[7px] text-[#87878D] text-[14px] mt-4">
        <PlanningPermissionCheckbox
          label="Yes"
          checked={!!data.hasZoningPermission}
          onChange={() =>
            setData((prev) => ({ ...prev, hasZoningPermission: true }))
          }
        />
        <PlanningPermissionCheckbox
          label="No"
          checked={data.hasZoningPermission === false}
          onChange={() =>
            setData((prev) => ({ ...prev, hasZoningPermission: false }))
          }
        />
      </div>
    </div>
  );
};
export default PlanningPermission;
