export function formatDate(dateString) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(dateString);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedDate = `${day} ${month} ${year} at ${hours}:${minutes} ${ampm}`;

  return formattedDate;
}

const addSeperator = (x: number | string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatNumber = (x: number | string) => {
  const num = x.toString();
  const numIndex = num.indexOf(".");

  if (numIndex !== -1) {
    const numBeforeDecimals = addSeperator(num.substring(0, numIndex));
    const numAfterDecimals = num.substring(numIndex);

    return numBeforeDecimals + numAfterDecimals;
  }

  return addSeperator(x);
};
export const getMapboxStaticImage = (lat, lng) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},14/350x150?access_token=${accessToken}`;
};