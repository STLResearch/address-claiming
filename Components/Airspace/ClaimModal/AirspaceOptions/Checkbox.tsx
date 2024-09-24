import React from "react";
interface CheckboxProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  disabled,
  onChange,
}) => {
  return (
    <>
      <input
        className="h-[18px] w-[18px] cursor-pointer"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={label}>{label}</label>
    </>
  );
};
export default Checkbox;
