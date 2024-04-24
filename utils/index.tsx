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


export function getFormattedDate(): string {
  const months: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];
  const date: Date = new Date();
  const day: number = date.getDate();
  const month: string = months[date.getMonth()];
  const year: number = date.getFullYear();
  
  // Function to add ordinal suffix to the day
  function getOrdinalSuffix(day: number): string {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
          case 1: return "st";
          case 2: return "nd";
          case 3: return "rd";
          default: return "th";
      }
  }

  const ordinalSuffix: string = getOrdinalSuffix(day);

  return `${day}${ordinalSuffix} ${month}, ${year}`;
}

export function calculateTimeDifference(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);


  const timeDiff = end.getTime() - start.getTime();


  const days = timeDiff / (1000 * 60 * 60 * 24);


  const roundedDays = Math.round(days * 100) / 100;

  return `${roundedDays} Days`;
}
