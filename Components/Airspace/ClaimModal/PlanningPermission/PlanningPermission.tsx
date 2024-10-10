import React from "react";
import PlanningPermissionCheckbox from "./PlanningPermissionCheckbox";
import { PropertyData } from "@/types";

interface PlanningPermissionProps {
  isActive: boolean | null | undefined;
  setData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const PlanningPermission: React.FC<PlanningPermissionProps> = ({ isActive, setData }) => {
  return (
    <div className="mt-4">
      <p className="text-[16px] font-normal text-[#838187] md:text-[14px]">
        Do you currently have zoning or planning permission to develop above your land or property?{" "}
        <span className="text-[12px] italic md:text-[10px]">
          (Your answer won&apos;t affect your claim)
          <span className="text-[#E04F64]">*</span>
        </span>{" "}
      </p>
      <div className="mt-4 flex items-center gap-[7px] text-[14px] text-[#87878D]">
        <PlanningPermissionCheckbox
          label="Yes"
          checked={isActive === true}
          onChange={() => setData((prev) => ({ ...prev, isActive: true }))}
        />
        <PlanningPermissionCheckbox
          label="No"
          checked={isActive === false}
          onChange={() => setData((prev) => ({ ...prev, isActive: false }))}
        />
        <PlanningPermissionCheckbox
          label="I don't Know"
          checked={isActive === null}
          onChange={() => setData((prev) => ({ ...prev, isActive: null }))}
        />
      </div>
    </div>
  );
};
export default PlanningPermission;
