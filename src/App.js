import React from "react";
import "./style.css";
import fetchData from "./FetchData";
import CitySelector from "./CitySelector";
import Filters from "./Filters";
import timeTodayOfWeek from "./utils/timetodayofweek";
import timeToAmPm from "./utils/timetoampm";
import sortFilters from "./utils/sortFilters";
import applyFilters from "./utils/applyFilters";
const App = () => {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [city, setCity] = React.useState("NYC");
  const [availableFilters, setAvailableFilters] = React.useState({
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
  });
  const [activeFilters, setActiveFilters] = React.useState({
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
  });
  React.useEffect(() => {
    setActiveFilters({
      date: [],
      neighborhood: [],
      start_time: [],
      topics: [],
      types: [],
    });
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchData(city);
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

  return (
    <div className="tailwind">
      <div className="absolute top-0 left-0 z-[100] flex bg-black w-[100dvw] justify-center text-white py-20">
        <div className="w-[84.5rem] flex flex-col gap-6">
          <div id="city-selector" className="flex gap-6 max-[980px]:hidden">
            <CitySelector
              data={["NEW YORK", "JUN 06 - JUN 10"]}
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
          <div id="contentAndFilters" className="flex gap-6 justify-between">
            <div className="flex flex-col gap-6 grow">
              <div
                id="content"
                className="border-[1px] border-white p-[3px] bg-black h-fit"
              >
                <div className="grow border-[1px] border-white">
                  {Array.isArray(filteredData) &&
                    filteredData.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col p-6 gap-2 border-b-[1px] border-white "
                      >
                        <div className="flex gap-4 text-[1.125rem] font-[500] leading-[1.1] tracking-[-0.02813rem] uppercase">
                          <div className="flex gap-2">
                            {item.is_featured && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                              >
                                <path
                                  d="M9.9999 14.8972L15.6924 18.333L14.1816 11.858L19.2107 7.50134L12.5882 6.93967L9.9999 0.833008L7.41156 6.93967L0.789062 7.50134L5.81823 11.858L4.3074 18.333L9.9999 14.8972Z"
                                  fill="#14E8FF"
                                />
                              </svg>
                            )}
                            <p className="text-brand">
                              {item.hosts.join(", ")}
                            </p>
                          </div>
                          <p>|</p>
                          <p className="text-grayText">
                            {item.day} {item.time}
                          </p>
                        </div>
                        <p className="text-[2rem] font-[500] leading-[1.2] tracking-[-0.04rem] capitalize">
                          {item.event_name}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
              <div className="grow" />
            </div>
            <div className="flex flex-col gap-6 relative ">
              <Filters
                city={city}
                setCity={setCity}
                availableFilters={availableFilters}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
              <div className="grow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
