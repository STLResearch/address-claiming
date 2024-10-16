import mapboxgl from "mapbox-gl";

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
  const lngLat = new mapboxgl.LngLat(property.longitude, property.latitude);
  const popup = new mapboxgl.Popup().setHTML(
    `<strong>${property.address}</strong>`,
  );

  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat(lngLat)
    .setPopup(popup)
    .addTo(map);
  return marker;
};

export const changeRentMarkerColor = (
  map,
  setSelectedAddress,
  marker,
  setMarker,
  item,
) => {
  setSelectedAddress(item.id);

  const lat1 = item.latitude;
  const lng1 = item.longitude;
  const ans2 = new mapboxgl.LngLat(lng1, lat1);
  if (marker) {
    marker.remove();
  }
  const marker1 = new mapboxgl.Marker({ color: "#0653EA" })
    .setLngLat(ans2)
    .addTo(map);
  setMarker(marker1);
};
