import React from 'react';

const RadarTooltip = ({ content }) => {
    return (
        <div className="tooltip bg-[#222222] text-white px-2 py-1 rounded-[3px] shadow-lg">
            {content}
        </div>
    );
};

export default RadarTooltip;
