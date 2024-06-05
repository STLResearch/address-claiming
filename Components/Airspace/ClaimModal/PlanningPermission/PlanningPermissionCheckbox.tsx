
interface PlanningPermissionCheckboxProps {
    label: string;
    checked: boolean | null;
    onChange: () => void;
  }
  
  const PlanningPermissionCheckbox: React.FC<PlanningPermissionCheckboxProps> = ({ label, checked, onChange }) => {
    return (
      <>
        <input
          className="relative h-[16.67px] w-[16.67px] cursor-pointer bg-cover p-[2.5px]"
          checked={checked || false}
          onChange={onChange}
          style={{
            appearance: "none",
            border: checked !== null ? "2px solid #222222" : "2px solid #0653EA",
            backgroundColor: checked ? "#0653EA" : "transparent",
            borderRadius: "50%",
            backgroundClip: "content-box",
          }}
          type="checkbox"
        />
        <label>{label}</label>
      </>
    );
  };
  export default PlanningPermissionCheckbox;