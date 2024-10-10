import React from "react";

interface ToggleProps {
  checked: boolean;
  setChecked: () => void;
}
const Toggle: React.FC<ToggleProps> = ({ checked, setChecked }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" value="" className="peer sr-only" checked={checked} onClick={setChecked} />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );
};
export default Toggle;
