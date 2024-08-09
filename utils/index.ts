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

export function convertDate(dateString: Date | string | null): string {
  // Create a new Date object from the input string
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  // Convert to ISO 8601 format
  const isoString = date.toISOString();

  return isoString;
}

export function shortenAddress(address: string, n: number): string {
  if (address.length <= 2 * n) {
    return address;
  }
  return (
    address.substring(0, n) + "..." + address.substring(address.length - n)
  );
}
