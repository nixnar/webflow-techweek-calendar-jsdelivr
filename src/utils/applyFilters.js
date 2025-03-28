export default function applyFilters(data, activeFilters) {
  // If no filters are selected in any category, return all data
  const hasActiveFilters = Object.values(activeFilters).some(
    (filterArray) => Array.isArray(filterArray) && filterArray.length > 0
  );

  if (!hasActiveFilters) {
    return data;
  }

  return data.filter((item) => {
    // For each filter category (date, neighborhood, etc.)
    return Object.keys(activeFilters).every((filterCategory) => {
      // If no filters are selected in this category, return true (don't filter)
      if (
        !activeFilters[filterCategory] ||
        activeFilters[filterCategory].length === 0
      ) {
        return true;
      }

      // Handle different categories
      switch (filterCategory) {
        case "date":
          return activeFilters.date.includes(item.day);

        case "neighborhood":
          return activeFilters.neighborhood.includes(item.neighborhood);

        case "start_time":
          return activeFilters.start_time.includes(item.time);

        case "topics":
          // Check if any of the item's themes match any selected topic filters
          return (
            item.themes &&
            item.themes.some((theme) => activeFilters.topics.includes(theme))
          );

        case "types":
          // Check if any of the item's formats match any selected type filters
          return (
            item.formats &&
            item.formats.some((format) => activeFilters.types.includes(format))
          );

        default:
          return true;
      }
    });
  });
}
