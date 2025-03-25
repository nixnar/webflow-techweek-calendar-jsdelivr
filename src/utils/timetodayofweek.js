export default function timeTodayOfWeek(date) {
  const dayNames = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const dateObj = new Date(date);
  return dayNames[dateObj.getDay()];
}
