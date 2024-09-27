export const fetchMapboxStaticImage = async (lat, lng) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},14/600x600?access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching static image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    return imageUrl;
  } catch (error) {
    console.error("Error fetching the Mapbox static image:", error);
    throw error;
  }
};
