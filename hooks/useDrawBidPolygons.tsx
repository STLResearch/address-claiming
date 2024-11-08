import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import mapboxgl, { Map } from "mapbox-gl";
import { useMobile } from "@/hooks/useMobile";
import { drawPolygons } from "@/utils/maputils";

import { AuctionDataI } from "@/types";
import { handleMouseEvent } from "@/utils/maputils/eventHandlerUtils/eventHandlers";
interface useDrawBidPolygonsProps {
  map: Map | null;
  auctions: AuctionDataI[];
  setShowBidDetail: any;
  setAuctionDetailData: any;
}

export const useDrawBidPolygons = ({
  map,
  auctions,
  setShowBidDetail,
  setAuctionDetailData,
}: useDrawBidPolygonsProps) => {
  const { isMobile } = useMobile();
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef({});
  const polygonsRef = useRef({});

  //@ts-ignore
  useEffect(() => {
    if (map) {
      const handleMapLoad = () => setMapLoaded(true);
      map.on("load", handleMapLoad);
      return () => map.off("load", handleMapLoad);
    }
  }, [map]);

  useEffect(() => {
    function convertVertexDataFormatToPolygonFormat(data) {
      return data.map((item) => [item.longitude, item.latitude]);
    }

    if (mapLoaded && map && auctions && auctions?.length > 0) {
      auctions.forEach((auction, index) => {
        const id = auction?.layer?.property?.id;
        const lngLat = new mapboxgl.LngLat(auction?.layer?.property?.longitude, auction?.layer?.property?.latitude);

        if (!markersRef.current[id]) {
          const marker = new mapboxgl.Marker({ color: "#3FB1CE" }).setLngLat(lngLat).addTo(map);
          markersRef.current[id] = marker;

          const markerElement = marker.getElement();
          if (markerElement && marker && map) {
            handleMouseEvent(isMobile, markerElement, marker, map, auction, setShowBidDetail, setAuctionDetailData);
          }
        } else {
          markersRef.current[id].setLngLat(lngLat);
        }

        if (!polygonsRef.current[id] && auction?.layer?.property?.vertexes) {
          const vertexAreaPolygon = convertVertexDataFormatToPolygonFormat(auction?.layer?.property?.vertexes);
          drawPolygons(map, id, vertexAreaPolygon);
          polygonsRef.current[id] = true;
        }
      });
    }
  }, [mapLoaded, map, auctions, isMobile]);
};
