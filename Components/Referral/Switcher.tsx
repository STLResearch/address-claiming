import React from "react";
interface SwitcherProps {
  sections: string[];
  activeSection: number;
  setActiveSection: React.Dispatch<React.SetStateAction<number>>;
}

const Switcher: React.FC<SwitcherProps> = ({ sections, activeSection, setActiveSection }) => {
  return (
    <div className="mx-auto flex items-center gap-[14px] md:hidden">
      {sections.map((text, index) => (
        <div
          key={text}
          onClick={() => setActiveSection(index)}
          className={`${index === activeSection ? "bg-[#222222] text-white" : "bg-[#2222221A] text-[#222222]"} cursor-pointer rounded-md p-[10px] text-[15px] font-normal`}
        >
          {text}
        </div>
      ))}
    </div>
  );
};

export default Switcher;
