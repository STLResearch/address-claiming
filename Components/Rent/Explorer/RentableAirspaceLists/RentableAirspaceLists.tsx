import { BalanceLoader } from "@/Components/Wrapped";
import React, { useEffect, useRef, useState } from "react";
import { Map, Marker } from "mapbox-gl";
import { VariableSizeGrid as Grid } from "react-window";
import RentCard from "../RentCard";
import { PropertyData } from "@/types";

interface RentableAirspaceListsProps {
  loadingReg: boolean;
  regAdressShow: boolean;
  registeredAddress: PropertyData[];
  setRentData: React.Dispatch<React.SetStateAction<PropertyData>>;
  setShowRentDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setRegAdressShow?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RentableAirspaceLists: React.FC<RentableAirspaceListsProps> = ({
  loadingReg,
  regAdressShow,
  registeredAddress,
  setRentData,
  setShowRentDetail,
  setRegAdressShow,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setRegAdressShow && setRegAdressShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [divRef]);

  const onClickRent = (item: PropertyData) => {
    setRentData(item);
    setShowRentDetail(true);
  };
  const columnCount = 2;

  const rowCount = Math.ceil(registeredAddress.length / columnCount);
  const getColumnWidth = () => 230;
  const getRowHeight = () => 250;

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const itemIndex = rowIndex * columnCount + columnIndex;
    if (itemIndex >= registeredAddress.length) {
      return null;
    }
    const item = registeredAddress[itemIndex];
    return (
      <div style={style} className="p-2">
        <RentCard onClickRent={() => onClickRent(item)} price={item.price} title={item.title} item={item} />
      </div>
    );
  };

  return (
    <div className="w-full">
      {loadingReg && (
        <div className="mt-2 flex w-full justify-center">
          <BalanceLoader />
        </div>
      )}
      {(!registeredAddress || (registeredAddress && registeredAddress?.length === 0 && !loadingReg)) && (
        <div className="mt-2 flex w-full justify-center">no airspace for rent</div>
      )}

      {regAdressShow && (
        <div
          ref={divRef}
          style={{ boxShadow: "0px 12px 34px -10px #3A4DE926" }}
          className="mt-2 h-[480px] w-full bg-white"
        >
          <Grid
            columnCount={columnCount}
            columnWidth={getColumnWidth}
            height={440}
            rowCount={rowCount}
            rowHeight={getRowHeight}
            width={470}
          >
            {Cell}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default RentableAirspaceLists;
