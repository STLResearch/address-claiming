
import ReactDom from "next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.production";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import RentMarkerPopup from "@/Components/Rent/RentMarkerPopup";

export const handleMouseEvent = (isMobile, markerElement, marker, map,data) => {
  // const customPopupStyles = `
  //   .mapboxgl-popup-close-button {
  //     display: ${isMobile ? "block" : "none"};
  //     position: absolute;
  //     top: 9px;
  //     right: 11px;
  //     font-size: x-large;
  //   }
  //   .mapboxgl-popup {
  //     position: relative;
  //     background-color: #ffffff !important;
  //   }
  //   .mapboxgl-popup-content {
  //     font-family: 'Poppins', sans-serif !important;
  //     font-weight: 400 !important;
  //     padding: 0px !important;
  //     cursor: pointer;
  //     width: ${isMobile ? "321px" : "266px"};
  //   }
  //   .mapboxgl-popup-tip {
  //     display: none !important;
  //   }
  //   .mapboxgl-popup-content div {
  //     margin: 0px !important;
  //   }
  //   .mapboxgl-popup-anchor-top > .mapboxgl-popup-content {
  //     margin-top: 15px;
  //     display: none;
  //   }
  //   .mapboxgl-popup-anchor-top > .mapboxgl-popup-tip {
  //     display: none;
  //   }
  // `;

  // if (typeof document !== "undefined") {
  //   const styleElement = document.createElement("style");
  //   styleElement.textContent = customPopupStyles;
  //   document.head.appendChild(styleElement);
  // } else {
  //   console.error("Cannot create style element: document is not defined.");
  // }
  if (!isMobile) {
    markerElement.addEventListener("mouseenter", () => {
      const tooltipContent = ReactDom.renderToString(
        <RentMarkerPopup
          data={data}
        />
      );

      new mapboxgl.Popup({
        closeOnClick: false,
        offset: [0, -20],
        className: "marker-popup-hovered-class",
      })
        .setLngLat(marker.getLngLat())
        .setHTML(tooltipContent)
        .addTo(map);
    });
    markerElement.addEventListener("mouseleave", () => {
      const elementToRemove = document.querySelector(
        ".marker-popup-hovered-class"
      );
      if (elementToRemove) elementToRemove.remove();
    });
  } else {
    markerElement.addEventListener("touchend", (e) => {
      const elementToRemove = document.querySelector(
        ".marker-popup-hovered-class"
      );
      if (elementToRemove) elementToRemove.remove();
      const tooltipContent = ReactDom.renderToString(
        <RentMarkerPopup
          data={data}
        />
      );

      new mapboxgl.Popup({
        closeOnClick: false,
        offset: [0, -20],
        className: "marker-popup-hovered-class",
      })
        .setLngLat(marker.getLngLat())
        .setHTML(tooltipContent)
        .addTo(map);
    });
  }
};