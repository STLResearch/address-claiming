import React from "react";
interface FeatureCheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const FeatureCheckbox: React.FC<FeatureCheckboxProps> = ({ label, id, checked, onChange }) => {
  return (
    <div className="flex items-center gap-[5px]">
      <input
        className="h-[18px] w-[18px] cursor-pointer"
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className="text-[14px] font-normal text-[#87878D]">
        {label}
      </label>
    </div>
  );
};

export default FeatureCheckbox;
