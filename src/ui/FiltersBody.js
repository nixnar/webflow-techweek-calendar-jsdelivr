import React from "react";
import FilterCategory from "./FilterCategory";
import FilterButton from "./FilterButton";

export default function FiltersBody({
  activeFilters,
  setActiveFilters,
  availableFilters,
  searchRef,
  searchMode,
}) {
  const [searchTerm, setSearchTerm] = React.useState(activeFilters.search);
  const [neighborhoodExpanded, setNeighborhoodExpanded] = React.useState(false);
  const [topicsExpanded, setTopicsExpanded] = React.useState(false);
  const [typesExpanded, setTypesExpanded] = React.useState(false);

  // Sync local searchTerm with activeFilters.search when it changes externally
  React.useEffect(() => {
    setSearchTerm(activeFilters.search);
  }, [activeFilters.search]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Update search filter in activeFilters
    setActiveFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };

  // Effect to focus search input when in search mode
  React.useEffect(() => {
    if (searchMode && searchRef.current) {
      const searchInput = searchRef.current.querySelector('input[type="text"]');
      if (searchInput) {
        setTimeout(() => {
          searchInput.focus();
        }, 100);
      }
    }
  }, [searchMode, searchRef]);

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

  // Helper to limit items to 2 rows (approximately 4-5 items per row based on current styling)
  const limitItems = (items, isExpanded) => {
    return isExpanded ? items : items.slice(0, 6);
  };

  // Animation style for filter categories
  const animationStyle = {
    transition: "max-height 500ms ease-in-out, opacity 500ms ease-in-out",
    overflow: "hidden",
  };

  return (
    <div id="filters-body" className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="text-[18px] leading-[23px]">Event Filters</div>
        <FilterButton
          text="Clear All"
          onClick={() =>
            setActiveFilters({
              date: [],
              neighborhood: [],
              start_time: [],
              topics: [],
              types: [],
              search: "",
            })
          }
          isDisabled={Object.keys(activeFilters).length === 0}
        />
      </div>
      {/* Search Bar */}
      <FilterCategory text="Search" ref={searchRef}>
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search by keyword..."
            value={activeFilters.search}
            onChange={handleSearch}
            className="w-full px-2 py-1.5 border-[1px] text-[14px] transition-colors border-white40 bg-black text-white focus:outline-none hover:border-white"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              onClick={() => {
                setSearchTerm("");
                setActiveFilters((prev) => ({
                  ...prev,
                  search: "",
                }));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </FilterCategory>
      <FilterCategory
        text="Day of Week"
        filtered={activeFilters.date.length > 0}
        onClickFunction={() =>
          setActiveFilters((prev) => ({
            ...prev,
            date: [],
          }))
        }
      >
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
      <FilterCategory
        text="Neighborhood"
        filtered={activeFilters.neighborhood.length > 0}
        onClickFunction={() =>
          setActiveFilters((prev) => ({
            ...prev,
            neighborhood: [],
          }))
        }
      >
        <div className="flex flex-wrap gap-2">
          {!neighborhoodExpanded &&
            availableFilters.neighborhood
              .slice(0, 6)
              .map((neighborhood) => (
                <FilterButton
                  key={neighborhood}
                  text={neighborhood}
                  onClick={() =>
                    handleFilterClick("neighborhood", neighborhood)
                  }
                  isActive={activeFilters.neighborhood.includes(neighborhood)}
                />
              ))}
          {neighborhoodExpanded &&
            availableFilters.neighborhood.map((neighborhood) => (
              <FilterButton
                key={neighborhood}
                text={neighborhood}
                onClick={() => handleFilterClick("neighborhood", neighborhood)}
                isActive={activeFilters.neighborhood.includes(neighborhood)}
              />
            ))}
        </div>
        {availableFilters.neighborhood.length > 6 && (
          <button
            className="text-white text-[14px] font-[500] w-fit"
            onClick={() => setNeighborhoodExpanded(!neighborhoodExpanded)}
          >
            {neighborhoodExpanded ? "See less" : "See more"}
          </button>
        )}
      </FilterCategory>
      <FilterCategory text="Start Time">
        <div className="w-full">
          <select
            className="w-full border-[1px] text-[14px] px-2 py-1.5 transition-colors border-white40 hover:border-white bg-black text-white focus:outline-none text-center appearance-none [-webkit-appearance:none] [-moz-appearance:none]"
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
      <FilterCategory
        text="Topics"
        filtered={activeFilters.topics.length > 0}
        onClickFunction={() =>
          setActiveFilters((prev) => ({ ...prev, topics: [] }))
        }
      >
        <div className="flex flex-wrap gap-2">
          {!topicsExpanded &&
            availableFilters.topics
              .slice(0, 6)
              .map((topic) => (
                <FilterButton
                  key={topic}
                  text={topic}
                  onClick={() => handleFilterClick("topics", topic)}
                  isActive={activeFilters.topics.includes(topic)}
                />
              ))}
          {topicsExpanded &&
            availableFilters.topics.map((topic) => (
              <FilterButton
                key={topic}
                text={topic}
                onClick={() => handleFilterClick("topics", topic)}
                isActive={activeFilters.topics.includes(topic)}
              />
            ))}
        </div>
        {availableFilters.topics.length > 6 && (
          <button
            className="text-white text-[14px] font-[500] w-fit"
            onClick={() => setTopicsExpanded(!topicsExpanded)}
          >
            {topicsExpanded ? "See less" : "See more"}
          </button>
        )}
      </FilterCategory>
      <FilterCategory
        text="Types"
        filtered={activeFilters.types.length > 0}
        onClickFunction={() =>
          setActiveFilters((prev) => ({ ...prev, types: [] }))
        }
      >
        <div
          className="flex flex-wrap gap-2"
          style={{
            ...animationStyle,
            maxHeight: "1000px",
          }}
        >
          {!typesExpanded &&
            availableFilters.types.slice(0, 6).map((type) => {
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
          {typesExpanded &&
            availableFilters.types.map((type) => {
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
        {availableFilters.types.length > 6 && (
          <button
            className="text-white text-[14px] font-[500] w-fit"
            onClick={() => setTypesExpanded(!typesExpanded)}
          >
            {typesExpanded ? "See less" : "See more"}
          </button>
        )}
      </FilterCategory>
    </div>
  );
}
