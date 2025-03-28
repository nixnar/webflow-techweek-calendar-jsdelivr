export default function sortFilters(result) {
  const newFilters = {
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
  };
  result.forEach((item) => {
    if (!newFilters.date.includes(item.day)) {
      newFilters.date.push(item.day);
    }
    if (
      item.neighborhood &&
      !newFilters.neighborhood.includes(item.neighborhood)
    ) {
      newFilters.neighborhood.push(item.neighborhood);
    }
    if (!newFilters.start_time.includes(item.time)) {
      newFilters.start_time.push(item.time);
    }

    if (item.themes) {
      item.themes.forEach((theme) => {
        if (!newFilters.topics.includes(theme) && theme !== "") {
          newFilters.topics.push(theme);
        }
      });
    }

    if (item.formats) {
      item.formats.forEach((format) => {
        if (!newFilters.types.includes(format) && format !== "") {
          newFilters.types.push(format);
        }
      });
    }
  });

  // Custom sort for days of the week (Monday first, Sunday last)
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  newFilters.date.sort((a, b) => {
    return dayOrder[a] - dayOrder[b];
  });

  // Custom sort for time (AM first, PM last)
  newFilters.start_time.sort((a, b) => {
    const aIsPM = a.includes("PM");
    const bIsPM = b.includes("PM");

    // If one is AM and one is PM
    if (aIsPM !== bIsPM) {
      return aIsPM ? 1 : -1; // AM comes first
    }

    // Both are AM or both are PM, sort by hour
    const aTime = parseFloat(a.split(":")[0]);
    const bTime = parseFloat(b.split(":")[0]);
    return aTime - bTime;
  });

  // Standard alphabetical sort for other filters
  newFilters.neighborhood.sort();
  newFilters.topics.sort();
  newFilters.types.sort();

  return newFilters;
}
