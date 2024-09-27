import React from "react";
interface IProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const labelClassNames = "text-[#0E2B56] font-poppins";

const AirRightEstimateMetadata = (props: IProps) => {
  return (
    <div className="flex items-center rounded-xl bg-[#DEE9F8] px-5 py-1">
      <div className="w-5 h-5">{props.icon}</div>

      <div className="flex flex-col ml-6">
        <span className={`${labelClassNames} text-[13px]`}>{props.title}</span>

        <span className={`${labelClassNames} font-bold`}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(props.value))}
        </span>
      </div>
    </div>
  );
};

export default AirRightEstimateMetadata;
