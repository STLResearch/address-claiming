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

export function shortenAddress(address: string, maxLength: number): string {
  if (address.length <= maxLength) {
    return address;
  }
  return address.substring(0, maxLength - 3) + "...";
}

export const calculateTimeLeft = (targetDate) => {
  const currentDate = new Date();
  const target = new Date(targetDate);

  //@ts-ignore
  const difference = target - currentDate;

  if (difference <= 0) {
    return "Time is up!";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  let result = "";

  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""} `;
  }
  if (hours > 0 && days < 1) {
    result += `${hours} hour${hours > 1 ? "s" : ""} `;
  }
  if (minutes > 0 && days < 1 && hours < 1) {
    result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }
  if (seconds > 0 && days < 1 && hours < 1 && minutes < 1) {
    result += `${seconds} second${seconds > 1 ? "s" : ""} `;
  }

  return result.trim();
};
