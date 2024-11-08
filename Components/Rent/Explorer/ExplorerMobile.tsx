import React, { useEffect, useRef, useState } from "react";
import { PropertyData } from "@/types";
import RentCard from "./RentCard";
import { FixedSizeList as List } from "react-window";

interface ExplorerMobileProps {
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
  registeredAddress: PropertyData[];
  setShowRentDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
}

const ExplorerMobile: React.FC<ExplorerMobileProps> = ({
  registeredAddress,
  setShowRentDetail,
  setRentData,
  setShowOptions,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [toggleTray, setToggleTray] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  const onClickRent = (item) => {
    setRentData(item);
    setShowRentDetail(true);
    setToggleTray(false);
  };

  const Row = ({ index, style }) => (
    <div style={style} className="w-full">
      <RentCard
        onClickRent={() => onClickRent(registeredAddress[index])}
        price={registeredAddress[index].price}
        title={registeredAddress[index].title}
        item={registeredAddress[index]}
      />
    </div>
  );

  return (
    <div className="md:hidden fixed bottom-[74px] left-0 w-full z-20 bg-white p-4 text-center rounded-t-[30px]">
      <div onClick={() => setToggleTray(!toggleTray)} className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 animate-pulse h-2 rounded-3xl bg-light-grey"></div>
        <h4>{registeredAddress?.length} Airspaces available</h4>
      </div>
      {toggleTray && registeredAddress?.length > 0 && (
        <div className="h-[400px] w-full overflow-y-auto flex flex-col items-center gap-4 mt-6">
          <List
            height={400} 
            itemCount={registeredAddress.length} 
            itemSize={260} 
            width="100%"
          >
            {Row}
          </List>
        </div>
      )}
    </div>
  );
};

export default ExplorerMobile;
