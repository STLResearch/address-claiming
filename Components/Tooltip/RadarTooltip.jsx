import React from 'react';

const RadarTooltip = ({ content }) => {
    return (
        <div className="tooltip bg-gray-800 text-white px-2 py-1 rounded-md shadow-lg">
            {content}
        </div>
    );
};

export default RadarTooltip;
