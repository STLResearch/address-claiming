import React from 'react';
import { ClearIcon, RectangleIcon } from "../Icons";

interface Props {
  onClose: () => void;
}

const RadarModalHeader: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="flex justify-end items-center mt-4 md:mt-0">
      <div className="w-[90%] flex justify-center items-center md:hidden">
        <RectangleIcon />
      </div>
      <div onClick={onClose} className="cursor-pointer">
        <ClearIcon />
      </div>
    </div>
  );
};

export default RadarModalHeader;
