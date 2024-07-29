import { PropertyData } from "@/types";
import mapboxgl from "mapbox-gl";
import { handleMouseEvent } from "./eventHandlers";
import { drawPolygons } from "../maputils";

export const createAndUpdateClusters = (
  map: mapboxgl.Map,
  markersRef: React.MutableRefObject<mapboxgl.Marker[]>,
  responseData: PropertyData[],
  clusterIndex: any,
  isMobile: boolean,
  setRentData: any,
  setShowClaimModal: any,
  zoom: number,
  bounds: any
) => {
  //   clearMarkers(markersRef);
  //   removeClusterLayers(map);
  //   if (map && responseData) {
  //     const geoJSONData = responseData.map((point) => ({
  //       type: "Feature",
  //       properties: { id: point.id },
  //       geometry: {
  //         type: "Point",
  //         coordinates: [point.longitude, point.latitude],
  //       },
  //     }));
  //     clusterIndex.current.load(geoJSONData);

  //     const bounds = map.getBounds().toArray().flat();
  //     const clusters = clusterIndex.current.getClusters(bounds, Math.round(zoom));

  //     if (map.getSource("markers")) {
  //       (map.getSource("markers") as mapboxgl.GeoJSONSource).setData({
  //         type: "FeatureCollection",
  //         features: clusters,
  //       });
  //     } else {
  //       map.addSource("markers", {
  //         type: "geojson",
  //         data: {
  //           type: "FeatureCollection",
  //           features: clusters,
  //         },
  //       });

  //       map.addLayer({
  //         id: "clusters",
  //         type: "circle",
  //         source: "markers",
  //         filter: ["has", "point_count"],
  //         paint: {
  //           "circle-color": "#00AEEF",
  //           "circle-radius": [
  //             "step",
  //             ["get", "point_count"],
  //             37,
  //             50,
  //             52,
  //             100,
  //             72,
  //             550,
  //             82,
  //             900,
  //             124,
  //           ],
  //           "circle-stroke-width": 2,
  //           "circle-stroke-color": "#fff",
  //         },
  //       });

  //       map.addLayer({
  //         id: "cluster-count",
  //         type: "symbol",
  //         source: "markers",
  //         filter: ["has", "point_count"],
  //         layout: {
  //           "text-field": "{point_count_abbreviated}",
  //           "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
  //           "text-size": 12,
  //         },
  //         paint: {
  //           "text-color": "#fff",
  //         },
  //       });
  //     }
  //   }
  if (!map || !clusterIndex.current) return;
  const geoJSONData = responseData.map((point) => ({
    type: "Feature",
    properties: { point },
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
  }));
  clusterIndex.current.load(geoJSONData);
  // const bounds = map.getBounds().toArray().flat();
  //   const zoom = map.getZoom();
  const clusters = clusterIndex.current.getClusters(bounds, Math.round(zoom));

  const markersGeoJSON = {
    type: "FeatureCollection",
    features: clusters,
  };

  if (map.getSource("markers")) {
    (map.getSource("markers") as mapboxgl.GeoJSONSource).setData(
      markersGeoJSON
    );
  } else {
    map.addSource("markers", {
      type: "geojson",
      data: markersGeoJSON,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "markers",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#00AEEF",
        "circle-radius": [
          "step",
          ["get", "point_count"],
          37,
          50,
          52,
          100,
          72,
          550,
          82,
          900,
          124,
        ],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "markers",
      filter: ["has", "point_count"],
      layout: {
        "text-allow-overlap": false,
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#fff",
      },
    });
  }

  // Remove existing markers
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];

  // Add new markers for unclustered points
  clusters.forEach((feature) => {
    if (!feature.properties.cluster) {
      const coordinates = feature.geometry.coordinates;
      const properties = feature?.properties?.point;

      const marker = new mapboxgl.Marker({
        color: "#3FB1CE",
      })
        .setLngLat(coordinates)
        .addTo(map);

      markersRef.current.push(marker);

      const markerElement = marker.getElement();
      handleMouseEvent(isMobile, markerElement, marker, map, properties);

      marker.getElement().addEventListener("click", function () {
        setRentData(properties);
        setShowClaimModal(true);
      });
    }
  });
};

// export const drawMarkers = (
//   map: mapboxgl.Map,
//   markersRef: React.MutableRefObject<mapboxgl.Marker[]>,
//   responseData: PropertyData[],
//   isMobile: boolean,
//   setRentData: any,
//   setShowClaimModal: any,
//   polygonsRef: any
// ) => {
//   clearMarkers(markersRef);
//   removeClusterLayers(map);

//   if (responseData && responseData.length > 0 && map.getZoom() >= 8) {
//     for (let i = 0; i < responseData.length; i++) {
//       const lngLat = new mapboxgl.LngLat(
//         responseData[i].longitude,
//         responseData[i].latitude
//       );

//       const marker = new mapboxgl.Marker({
//         color: "#3FB1CE",
//       })
//         .setLngLat(lngLat)
//         .addTo(map);

//       markersRef.current.push(marker);

//       const markerElement = marker.getElement();
//       handleMouseEvent(isMobile, markerElement, marker, map, responseData[i]);
//       if (!polygonsRef.current[i]) {
//         const vertexAreaPolygon = convertVertexDataFormatToPolygonFormat(
//           responseData[i]?.vertexes
//         );
//         drawPolygons(map, i, vertexAreaPolygon);
//         polygonsRef.current[i] = true;
//       }
//       marker.getElement().addEventListener("click", function () {
//         setRentData(responseData[i]);
//         setShowClaimModal(true);
//       });
//     }
//   }
// };
// export const clearMarkers = (
//   markersRef: React.MutableRefObject<mapboxgl.Marker[]>
// ) => {
//   markersRef.current.forEach((marker) => marker.remove());
//   markersRef.current = [];
// };
// export const removeClusterLayers = (map: mapboxgl.Map) => {
//   if (map.getLayer("clusters")) {
//     map.removeLayer("clusters");
//   }
//   if (map.getLayer("cluster-count")) {
//     map.removeLayer("cluster-count");
//   }
//   if (map.getSource("markers")) {
//     map.removeSource("markers");
//   }
// };
function convertVertexDataFormatToPolygonFormat(data) {
  return data.map((item) => [item.longitude, item.latitude]);
}
