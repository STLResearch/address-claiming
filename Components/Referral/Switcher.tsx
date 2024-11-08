import React from "react";
interface SwitcherProps {
  sections: string[];
  activeSection: number;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
}

const Switcher: React.FC<SwitcherProps> = ({
  sections,
  activeSection,
  setActiveSection,
}) => {
  return (
    <div className="md:hidden w-full  px-4 mb-6">
      <div className="w-full overflow-x-scroll no-scrollbar">
        <div className="flex justify-center items-center w-[450px] gap-4 ">
          {sections.map((text, index) => (
            <div
              key={text}
              onClick={() => setActiveSection(index)}
              className={`${index === activeSection ? "bg-[#222222] text-white text-center " : "bg-[#2222221A] text-[#222222]"} cursor-pointer text-[15px] font-normal p-[10px] rounded-md text-center `}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Switcher;
