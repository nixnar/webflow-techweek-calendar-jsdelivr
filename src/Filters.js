import React from "react";
import FilterButton from "./ui/FilterButton";
import FilterCategory from "./ui/FilterCategory";
export default function Filters({
  city,
  setCity,
  availableFilters,
  activeFilters,
  setActiveFilters,
}) {
  const handleFilterClick = (filterType, filterValue) => {
    if (activeFilters[filterType].includes(filterValue)) {
      setActiveFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: prevFilters[filterType].filter((f) => f !== filterValue),
      }));
    } else {
      setActiveFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: [...prevFilters[filterType], filterValue],
      }));
    }
  };

  const convertTimeToMinutes = (timeStr) => {
    // Handle formats like "8am", "9pm", "12pm", etc.
    const isPM =
      timeStr.toLowerCase().includes("pm") &&
      !timeStr.toLowerCase().includes("12pm");
    const is12AM = timeStr.toLowerCase().includes("12am");

    // Extract the hour
    const hourMatch = timeStr.match(/\d+/);
    let hour = hourMatch ? parseInt(hourMatch[0]) : 0;

    // Adjust for PM times (add 12 hours)
    if (isPM) hour += 12;
    // 12am is actually 0 in 24-hour format
    if (is12AM) hour = 0;

    return hour * 60; // Convert to minutes for easy comparison
  };

  return (
    <div
      id="filters"
      className="w-[25.5rem] max-h-[80dvh]  border-[1px] border-white p-[3px] bg-black sticky top-6 max-[980px]:absolute max-[980px]:top-0 max-[980px]:h-[100dvh] max-[980px]:w-[22.5rem] max-[980px]:right-0"
    >
      <div
        className="border-[1px] border-white h-full p-6 overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div id="filters-body" className="flex flex-col gap-6">
          <FilterCategory text="Day of Week">
            <div className="flex flex-wrap gap-2">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <FilterButton
                  key={day}
                  text={day}
                  onClick={() => handleFilterClick("date", day)}
                  isActive={activeFilters.date.includes(day)}
                  isDisabled={!availableFilters.date.includes(day)}
                />
              ))}
            </div>
          </FilterCategory>
          <FilterCategory text="Neighborhood">
            <div className="flex flex-wrap gap-2">
              {availableFilters.neighborhood.map((neighborhood) => (
                <FilterButton
                  key={neighborhood}
                  text={neighborhood}
                  onClick={() =>
                    handleFilterClick("neighborhood", neighborhood)
                  }
                  isActive={activeFilters.neighborhood.includes(neighborhood)}
                />
              ))}
            </div>
          </FilterCategory>
          <FilterCategory text="Start Time">
            <div className="w-full">
              <select
                className="w-full px-4 py-2 border-[1px] border-white bg-black text-white focus:outline-none text-center appearance-none [-webkit-appearance:none] [-moz-appearance:none]"
                onChange={(e) => {
                  const selectedTime = e.target.value;
                  if (selectedTime === "") {
                    // Clear the start time filter
                    setActiveFilters((prev) => ({
                      ...prev,
                      start_time: [],
                    }));
                  } else {
                    // Set filter to show times >= selected time
                    const availableTimes = availableFilters.start_time;
                    const filteredTimes = availableTimes.filter((time) => {
                      // Convert times to comparable format (assuming format like "8am", "9pm")
                      const selectedHour = convertTimeToMinutes(selectedTime);
                      const timeHour = convertTimeToMinutes(time);
                      return timeHour >= selectedHour;
                    });

                    setActiveFilters((prev) => ({
                      ...prev,
                      start_time: filteredTimes,
                    }));
                  }
                }}
                value={
                  activeFilters.start_time.length > 0
                    ? // Find the earliest time in active filters
                      availableFilters.start_time.find((time) =>
                        activeFilters.start_time.includes(time)
                      ) || ""
                    : ""
                }
              >
                <option value="">-</option>
                {availableFilters.start_time
                  .sort((a, b) => {
                    return convertTimeToMinutes(a) - convertTimeToMinutes(b);
                  })
                  .map((time) => (
                    <option key={time} value={time}>
                      {time} or later
                    </option>
                  ))}
              </select>
            </div>
          </FilterCategory>
          <FilterCategory text="Topics">
            <div className="flex flex-wrap gap-2">
              {availableFilters.topics.map((topic) => (
                <FilterButton
                  key={topic}
                  text={topic}
                  onClick={() => handleFilterClick("topics", topic)}
                  isActive={activeFilters.topics.includes(topic)}
                />
              ))}
            </div>
          </FilterCategory>
          <FilterCategory text="Types">
            <div className="flex flex-wrap gap-2">
              {availableFilters.types.map((type) => {
                if (type.startsWith("Match making")) {
                  return (
                    <FilterButton
                      key={type}
                      text={"Match making"}
                      onClick={() => handleFilterClick("types", type)}
                      isActive={activeFilters.types.includes(type)}
                    />
                  );
                } else {
                  return (
                    <FilterButton
                      key={type}
                      text={type}
                      onClick={() => handleFilterClick("types", type)}
                      isActive={activeFilters.types.includes(type)}
                    />
                  );
                }
              })}
            </div>
          </FilterCategory>
        </div>
      </div>
    </div>
  );
}
