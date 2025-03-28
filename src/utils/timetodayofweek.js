export default function timeTodayOfWeek(date) {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dateObj = new Date(date);
  return dayNames[dateObj.getDay()];
}
