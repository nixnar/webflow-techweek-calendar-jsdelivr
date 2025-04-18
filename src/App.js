import React from "react";
import "./style.css";
import fetchData from "./FetchData";
import CitySelector from "./CitySelector";
import Filters from "./Filters";
import timeTodayOfWeek from "./utils/timetodayofweek";
import timeToAmPm from "./utils/timetoampm";
import sortFilters from "./utils/sortFilters";
import applyFilters from "./utils/applyFilters";
import MobileFilters from "./MobileFilters";
import MobileCityDropdown from "./MobileCityDropdown";
import IndividualEvent from "./IndividualEvent";

const App = () => {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [city, setCity] = React.useState("NYC");
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [filterToggle, setFilterToggle] = React.useState(false);
  const [availableFilters, setAvailableFilters] = React.useState({
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
    search: "",
  });
  const [activeFilters, setActiveFilters] = React.useState({
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
    search: "",
  });

  React.useEffect(() => {
    setActiveFilters({
      date: [],
      neighborhood: [],
      start_time: [],
      topics: [],
      types: [],
      search: "",
    });
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchData(city);

        // Sort events by start_time before applying transformations
        result.sort((a, b) => {
          // Sort featured events first
          if (a.is_featured !== b.is_featured) {
            return b.is_featured - a.is_featured;
          }
          // Then sort by start time
          return new Date(a.start_time) - new Date(b.start_time);
        });

        // Apply time transformations after sorting
        result.forEach((item) => {
          item.day = timeTodayOfWeek(item.start_time);
          item.time = timeToAmPm(item.start_time);
        });

        setData(result);
        setAvailableFilters(sortFilters(result));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [city]);

  //reset filtered data when city changes
  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  //filter data based on active filters
  React.useEffect(() => {
    setFilteredData(applyFilters(data, activeFilters));
  }, [activeFilters]);

  // Add resize event listener
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="tailwind">
      <div className="flex w-full justify-center text-white select-none">
        <div className="max-w-[1400px] grow flex flex-col gap-4">
          <div className="mobile:hidden">
            <div id="city" className="flex gap-4">
              <CitySelector
                data={["NEW YORK", "JUN 02 - JUN 08"]}
                setCity={setCity}
                currentCity={city}
                city={"NYC"}
              />
              <CitySelector
                data={["SAN FRANCISCO", "OCT 06 - OCT 12"]}
                setCity={setCity}
                currentCity={city}
                city={"SF"}
              />
              <CitySelector
                data={["LOS ANGELES", "OCT 13 - OCT 19"]}
                setCity={setCity}
                currentCity={city}
                city={"LA"}
              />
            </div>
          </div>
          <div id="contentAndFilters" className="flex gap-4 justify-between">
            <div className="flex flex-col gap-4 grow">
              <div
                id="content"
                className="border-[1px] border-white p-[4px] bg-black h-fit"
              >
                {windowWidth <= 1030 && (
                  <div className="flex w-full justify-between items-center border-[1px] border-white p-[4px] sticky top-0 bg-black">
                    <MobileCityDropdown city={city} setCity={setCity} />
                    <button
                      onClick={() => setFilterToggle(!filterToggle)}
                      className="uppercase font-medium text-[0.875rem] flex items-center gap-[0.375rem] py-[0.375rem] px-[0.5rem] bg-white text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.625 1.75V3.47949C2.625 3.91016 2.83691 4.31348 3.19238 4.55957L6.125 6.78125V12.25L7.875 10.5V6.78125L10.8076 4.55957C11.1631 4.31348 11.375 3.91016 11.375 3.47949V1.75H2.625ZM3.5 2.625H10.5V3.47949C10.5 3.62305 10.4282 3.75635 10.3086 3.83838L10.3018 3.8418L7.29053 6.125H6.70947L3.69824 3.8418L3.69141 3.83838C3.57178 3.75635 3.5 3.62305 3.5 3.47949V2.625Z"
                          fill="black"
                        />
                      </svg>
                      <p>FILTERS</p>
                    </button>
                  </div>
                )}
                <div className="grow border-[1px] border-white ml-[-1px]">
                  {Array.isArray(filteredData) &&
                    filteredData.map((item) => {
                      if (item.invite_url !== "Invite Only") {
                        return (
                          <a href={item.invite_url} target="_blank">
                            <IndividualEvent
                              key={item.id}
                              item={item}
                              windowWidth={windowWidth}
                              hasLink={true}
                              className=""
                            />
                          </a>
                        );
                      } else {
                        return (
                          <IndividualEvent
                            key={item.id}
                            item={item}
                            windowWidth={windowWidth}
                            hasLink={false}
                            className="group-hover:"
                          />
                        );
                      }
                    })}
                </div>
              </div>
              <div className="grow" />
            </div>
            {windowWidth > 1030 ? (
              <div className="flex flex-col gap-4 relative">
                <Filters
                  city={city}
                  setCity={setCity}
                  availableFilters={availableFilters}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                />
                <div className="grow" />
              </div>
            ) : (
              filterToggle && (
                <MobileFilters
                  city={city}
                  setCity={setCity}
                  availableFilters={availableFilters}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  filterToggle={filterToggle}
                  setFilterToggle={setFilterToggle}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
