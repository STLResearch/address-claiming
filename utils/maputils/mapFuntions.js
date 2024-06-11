import maplibregl from "maplibre-gl";
export const toggleMapView = (map) => {
  if (map) {
    const currentStyleName = map?.getStyle().name;
    const newStyle =
      currentStyleName === "Mapbox Streets"
        ? "mapbox://styles/mapbox/satellite-v9"
        : "mapbox://styles/mapbox/streets-v12";
    map?.setStyle(newStyle);
  }
};
const adjustZoom = (delta, map) => {
  if (map) {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + delta);
  }
};

export const handleZoomIn = (map) => {
  adjustZoom(1, map);
};

export const handleZoomOut = (map) => {
  adjustZoom(-1, map);
};

export const createRentMarkerWithPopup = (map, property, markerElement) => {
  const lngLat = new maplibregl.LngLat(property.longitude, property.latitude);
  const popup = new maplibregl.Popup().setHTML(
    `<strong>${property.address}</strong>`
  );

  const marker = new maplibregl.Marker(markerElement)
    .setLngLat(lngLat)
    .setPopup(popup)
    .addTo(map);
    return marker;
}

export const changeRentMarkerColor = (map,setSelectedAddress,marker,setMarker,item) => {
  let el1 = document.createElement("div");
  console.log(item.id,"selected")
  setSelectedAddress(item.id);
  el1.id = "marker2";
  let lat1 = item.latitude;
  let lng1 = item.longitude;
  let ans2 = new mapboxgl.LngLat(lng1, lat1);
  if (marker) {
    marker.remove();
  }
  let marker1 = new maplibregl.Marker({ color: "#0653EA" })
    .setLngLat(ans2)
    .addTo(map);
  setMarker(marker1);
};
