import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import mapboxgl, { Map } from "mapbox-gl";
import { useMobile } from "@/hooks/useMobile";
import { drawPolygons } from "@/utils/maputils";
import { handleMouseEvent } from "@/utils/eventHandlerUtils/eventHandlers";
import { AuctionDataI } from "@/types";
interface useDrawBidPolygonsProps {
  map: Map | null;
  auctions: AuctionDataI[];
}

export const useDrawBidPolygons = ({
  map,
  auctions,
}: useDrawBidPolygonsProps) => {
  const { isMobile } = useMobile();
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef({});
  const polygonsRef = useRef({});

  const customPopupStyles = `
    .mapboxgl-popup-close-button {
      display: ${isMobile ? "block" : "none"};
      position: absolute;
      top: 9px;
      right: 11px;
      font-size: x-large;
    }
    .mapboxgl-popup {
      position: relative;
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
    if (map) {
      const handleMapLoad = () => setMapLoaded(true);
      map.on("load", handleMapLoad);
      return () => map.off("load", handleMapLoad);
    }
  }, [map]);

  useEffect(() => {
    if (mapLoaded && map && auctions && auctions?.length > 0) {
      auctions.forEach((auction, index) => {
        const id = auction?.properties[0]?.id;
        const lngLat = new mapboxgl.LngLat(
          auction?.properties[0]?.longitude,
          auction?.properties[0]?.latitude
        );

        if (!markersRef.current[id]) {
          let el = document.createElement("div");
          el.id = `markerWithExternalCss-${id}`;
          const marker = new maplibregl.Marker(el).setLngLat(lngLat).addTo(map);
          markersRef.current[id] = marker;

          const markerElement = marker.getElement();
          if (markerElement && marker && map) {
            handleMouseEvent(isMobile, markerElement, marker, map, auction);
          }
        } else {
          markersRef.current[id].setLngLat(lngLat);
        }

        if (!polygonsRef.current[id]) {
          drawPolygons(map, id, auction?.properties[0]?.vertexes);
          polygonsRef.current[id] = true;
        }
      });
    }
  }, [mapLoaded, map, auctions, isMobile]);
};
