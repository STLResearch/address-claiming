import React from 'react';
import RadarTooltip from "@/Components/Tooltip/RadarTooltip";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";

const customPopupStyles = `
  .mapboxgl-popup-close-button {
    display: none;
  }
  .mapboxgl-popup {
    background-color: #222222 !important;
    border-radius: 3px;
    text-align:center;
  }
  .mapboxgl-popup-content {
    font-family: 'Poppins', sans-serif !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    line-height: 18px !important;
    padding: 0px !important;
    width: 130px;
    cursor: pointer;
  }
  .mapboxgl-popup-tip {
    display: none !important;
  }
  .mapboxgl-popup-content div {
    padding: 10px;
    margin: 0px !important;
  }
  .mapboxgl-popup-anchor-top > .mapboxgl-popup-content {
    margin-top: 15px;
    display: none;
  }
  .mapboxgl-popup-anchor-top > .mapboxgl-popup-tip {
    display: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customPopupStyles;
  document.head.appendChild(styleElement);
} else {
  console.error('Cannot create style element: document is not defined.');
}

export const showPopup = (marker, popupName, className, map) => {
  const elementToRemove = document.querySelector(`.${className}`);
  if (elementToRemove) elementToRemove.remove();

  const tooltipContent = ReactDOMServer.renderToString(
    <RadarTooltip content={popupName} />
  );

  new mapboxgl.Popup({
    closeOnClick: false,
    offset: [0, -20],
    className: className,
  }).setLngLat(marker.getLngLat()).setHTML(tooltipContent).addTo(map);
};

export const createMarkerElement = (index) => {
  const markerElement = document.createElement("div");
  markerElement.classList.add(`drone-marker-${index}`);
  return markerElement;
};

export const createMarker = (latitude, longitude, markerElement, map) => {
  return new mapboxgl.Marker({
    element: markerElement,
    draggable: false,
  })
    .setLngLat([longitude, latitude])
    .addTo(map);
};

export const removeMarkerElements = (index) => {
  const elements = document.getElementsByClassName(`drone-marker-${index}`);
  Array.from(elements).forEach((element) => element.remove());
};
