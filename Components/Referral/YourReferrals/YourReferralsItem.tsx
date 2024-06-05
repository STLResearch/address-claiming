interface YourReferralsItemProps {
    icon:React.ReactNode, 
    number:number;
    text:string;
  }
const YourReferralsItem:React.FC<YourReferralsItemProps> = ({ icon, number, text }) => {
    return (
      <div className="flex items-center gap-[17px]">
        <div className="w-[34px] h-[34px]">{icon}</div>
        <p className="text-[40px] text-[#4285F4] font-semibold min-w-[25.84px] text-center">
          {number}
        </p>
        <p className="text-[15px] text-[#868686] font-normal">{text}</p>
      </div>
    );
  };

  export default YourReferralsItem;