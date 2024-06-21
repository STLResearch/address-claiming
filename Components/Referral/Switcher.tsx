interface SwitcherProps {
  sections:string[], 
  activeSection:number;
  setActiveSection:React.Dispatch<React.SetStateAction<number>>;
}

const Switcher:React.FC<SwitcherProps> = ({ sections, activeSection, setActiveSection }) => {
  return (
    <div className="md:hidden flex items-center gap-[14px] mx-auto">
      {sections.map((text, index) => (
        <div
          key={text}
          onClick={() => setActiveSection(index)}
          className={`${index === activeSection ? "bg-[#222222] text-white" : "bg-[#2222221A] text-[#222222]"} cursor-pointer text-[15px] font-normal p-[10px] rounded-[30px]`}
        >
          {text}
        </div>
      ))}
    </div>
  );
};
  
export default Switcher;