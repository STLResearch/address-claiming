import RentPopup from "@/Components/Rent/RentMarkerPopup";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import "@/Components/Rent/RentMarkerPopup.css";

export const handleMouseEvent = (
  isMobile,
  markerElement,
  marker,
  map,
  rent,
  setShowBidDetail,
  setAuctionDetailData
) => {

  const el = (
    <RentPopup
      rent={rent}
      setShowBidDetail={setShowBidDetail}
      setAuctionDetailData={setAuctionDetailData}
    />
  );
  const placeholder = document.createElement("div");
  const root = createRoot(placeholder);
  root.render(el);

  const removeExistingPopup = (className) => {
    const existingPopup = document.querySelector(`.${className}`);
    if (existingPopup) {
      existingPopup.remove(); 
    }
  };

  if (!isMobile) {
 
    markerElement.addEventListener("mouseenter", () => {

      removeExistingPopup("marker-popup-hovered-class");


      const popup = new mapboxgl.Popup({
        closeOnClick: false,
        offset: [0, -20],
        className: "marker-popup-hovered-class",
      })
        .setLngLat(marker.getLngLat())
        .setDOMContent(placeholder)
        .addTo(map);

      popup.on('close', () => {
        removeExistingPopup("marker-popup-hovered-class");
      });
    });
  } else {
    markerElement.addEventListener("touchend", (e) => {
      e.preventDefault(); 

      removeExistingPopup("marker-popup-hovered-class.mobile");

      const popup = new mapboxgl.Popup({
        closeOnClick: false,
        offset: [0, -20],
        className: "marker-popup-hovered-class mobile",
      })
        .setLngLat(marker.getLngLat())
        .setDOMContent(placeholder)
        .addTo(map);

      popup.on('close', () => {
        removeExistingPopup("marker-popup-hovered-class.mobile");
      });
    });
  }
};