import React from "react";

interface PlanningPermissionCheckboxProps {
  label: string;
  checked: boolean | null;
  onChange: () => void;
}

const PlanningPermissionCheckbox: React.FC<PlanningPermissionCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="relative h-[20px] w-[20px] cursor-pointer p-[3px] appearance-none border-2 border-[#222222] rounded-full checked:bg-[#222222] checked:border-[#222222] background-clip:content-box transition-all duration-200"
          checked={checked || false}
          onChange={onChange}
          style={{
            backgroundColor: checked ? "#222222" : "transparent",
            backgroundClip: "content-box",
          }}
        />
        <span className="ml-2 text-[14px] text-[#222222]">{label}</span>
      </label>
    </>
  );
};
export default PlanningPermissionCheckbox;
