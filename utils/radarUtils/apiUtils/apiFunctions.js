import axios from 'axios';
export const flyToUserIpAddress = async (map) => {
    if (!map) return;

    try {
        console.log('here called')
        // const ipResponse = await axios.get("https://api.ipify.org/?format=json");
        // const ipAddress = ipResponse.data.ip;
        const ipAddress = '196.189.246.115'
        const ipGeolocationApiUrl = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_IPGEOLOCATION}&ip=${ipAddress}`);
        const latitude = parseFloat(ipGeolocationApiUrl.data.latitude);
        const longitude = parseFloat(ipGeolocationApiUrl.data.longitude);

        if (isNaN(latitude) || isNaN(longitude)) return;

        map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
        });
    } catch (error) {
        console.error("Error:", error);
    }
};
export const goToAddress = async (flyToAddress,setCoordinates,setAddressData,setIsLoading,setMarker,map,marker) => {
    try {
      setIsLoading(true);

      const mapBoxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${flyToAddress}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

      const response = await fetch(mapBoxGeocodingUrl);

      if (!response.ok)
        throw new Error("Error while getting new address location");

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error("Address not found");
      }

      const coordinates = data.features[0].geometry.coordinates;
      const endPoint = [coordinates[0], coordinates[1]];

      setCoordinates({ longitude: coordinates[0], latitude: coordinates[1] });
      setAddressData(data.features[0].properties);
      setIsLoading(false);

      map.flyTo({
        center: endPoint,
        zoom: 16,
      });

      if (marker) {
        marker.remove();
      }

      let el = document.createElement("div");
      el.id = "markerWithExternalCss";

      const newMarker = new maplibregl.Marker(el)
        .setLngLat(endPoint)
        .addTo(map);
      setMarker(newMarker);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  export const getAddresses = async (setAddresses,setCoordinates,timeoutId,address) => {
    setCoordinates({ longitude: "", latitude: "" });

    timeoutId = setTimeout(async () => {
      try {
        const mapboxGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`;

        const response = await fetch(mapboxGeocodingUrl);

        if (!response.ok) throw new Error("Error while getting addresses");

        const data = await response.json();
        if (data.features && data.features.length > 0) {
          setAddresses(data.features);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.log(error);
      }
    }, 500);
  };