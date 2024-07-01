import { useEffect } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { drawPolygons } from "@/utils/maputils";
import maplibregl from "maplibre-gl";
import { handleMouseEvent } from "@/utils/eventHandlerUtils/eventHandlers";
interface useDrawBidPolygonsProps {
  map: Map | null;
  isMobile: boolean;
  auctions: any[];
}

export const useDrawBidPolygons = ({
  map,
  isMobile,
  auctions,
}: useDrawBidPolygonsProps) => {
  const customPopupStyles = `
    .mapboxgl-popup-close-button {
    position:absolute;
    top:9px;
    right:11px;
    font-size:x-large;
  }
    .mapboxgl-popup {
      position:relative;
      background-color: #ffffff !important;
    }
    .mapboxgl-popup-content {
      font-family: 'Poppins', sans-serif !important;
      font-weight: 400 !important;
      padding: 0px !important;
      cursor: pointer;
      width: ${isMobile ? "321px" : "266px"};
    }
    .mapboxgl-popup-tip {
      display: none !important;
    }
    .mapboxgl-popup-content div {
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

  if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.textContent = customPopupStyles;
    document.head.appendChild(styleElement);
  } else {
    console.error("Cannot create style element: document is not defined.");
  }
  useEffect(() => { 
    if (map ) {
      let el = document.createElement("div");
      el.id = "markerWithExternalCss";
      map.on("load", () => {
        if (auctions && auctions.length > 0) {
          for (let i = 0; i < auctions.length; i++) {
            const lngLat = new mapboxgl.LngLat(
              auctions[i]?.properties[0]?.longitude,
              auctions[i]?.properties[0]?.latitude
            );
            //create markers here
            const marker = new maplibregl.Marker(el)
              .setLngLat(lngLat)
              .addTo(map);

            const markerElement = marker.getElement();

            if (markerElement && marker && map) {
              handleMouseEvent(isMobile, markerElement, marker, map,auctions[i]);
            }
            drawPolygons(map, i, auctions[i]?.properties[0]?.vertexes);
          }
        }
      });
    }
  }, [map, auctions, isMobile]);
};
