import React, { FC } from 'react';

interface RadarTooltipProps {
    content: string;
}

const RadarTooltip: FC<RadarTooltipProps> = ({ content }) => {
    return (
        <div className="tooltip bg-light-black text-white px-2 py-1 rounded-[3px] shadow-lg">
            {content}
        </div>
    );
};

export default RadarTooltip;