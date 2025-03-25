import React from "react";
import "./style.css";
import fetchData from "./FetchData";
import CitySelector from "./CitySelector";
import timeTodayOfWeek from "./utils/timetodayofweek";
import timeToAmPm from "./utils/timetoampm";
const App = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [city, setCity] = React.useState("NYC");
  React.useEffect(() => {
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
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [city]);

  return (
    <div className="tailwind">
      <div className="flex bg-black w-[100dvw] justify-center text-white">
        <div className="w-[84.5rem] flex flex-col gap-6">
          <div id="city-selector" className="flex gap-6">
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
          <div id="contentAndFilters" className="flex gap-6">
            <div
              id="content"
              className="grow border-[1px] border-white p-[3px] bg-black"
            >
              <div className="grow border-[1px] border-white">
                {Array.isArray(data) &&
                  data.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col p-6 gap-2 border-b-[1px] border-white"
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
                          <p className="text-brand">{item.hosts.join(", ")}</p>
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
            <div className="flex flex-col gap-6">
              <div
                id="filters"
                className="w-[22rem] min-h-[40rem] border-[1px] border-white p-[3px] bg-black"
              >
                <div className="border-[1px] border-white h-full">
                  <div id="filters-header">
                    <h1>Filters</h1>
                  </div>
                </div>
              </div>
              <div className="grow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
