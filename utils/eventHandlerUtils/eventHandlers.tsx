import MarkerPopup from "@/Components/Buy/MarkerPopup";
import ReactDom from "next/dist/compiled/react-dom/cjs/react-dom-server-legacy.browser.production";
import mapboxgl, { Map, Marker } from "mapbox-gl";

export const handleMouseEvent = (isMobile, markerElement, marker, map,auction) => {
  
  if (!isMobile) {
    markerElement.addEventListener("mouseenter", () => {
      const tooltipContent = ReactDom.renderToString(
        <MarkerPopup
          auction={auction}
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
        <MarkerPopup
        auction={auction}

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
