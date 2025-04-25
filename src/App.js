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
  const [isValidEmail, setIsValidEmail] = React.useState(false);
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

  const submitForm = async (e) => {
    if (e) e.preventDefault();
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("https://api.tech-week.com/submit_email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      /* Check if cookie was set - wait a moment for cookie to be set
      setTimeout(() => {
        const cookieExists = document.cookie.includes("auth_token");

        if (!cookieExists) {
          // Cookie wasn't set - likely in incognito mode
          console.log("Cookie not set - user may be in incognito mode");
          // You can set a state variable here to show a message
          setError("incognito");
        } else {
          // Cookie was set successfully - proceed normally
          setError(null);
          window.location.reload();
        }
      }, 500); // Small delay to ensure cookie has time to be set*/
    } catch (error) {
      console.error("Error:", error);
      setError("incognito");
    }
  };

  // Validate email input
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setIsValidEmail(emailPattern.test(email));
  };

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

        // Check if result is the error code 10
        if (result === 10) {
          setIsLoading(false);
          setError("showForm");

          return;
        }

        // Separate events by tier
        const tier1Events = result.filter(
          (event) => event.starred_on_calendar === "TIER_1"
        );
        const tier2Events = result.filter(
          (event) => event.starred_on_calendar === "TIER_2"
        );
        const regularEvents = result.filter(
          (event) => !event.starred_on_calendar
        );

        // Randomize TIER_1 events
        for (let i = tier1Events.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tier1Events[i], tier1Events[j]] = [tier1Events[j], tier1Events[i]];
        }

        // Randomize TIER_2 events
        for (let i = tier2Events.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tier2Events[i], tier2Events[j]] = [tier2Events[j], tier2Events[i]];
        }

        // Sort regular events by start time
        regularEvents.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );

        // Combine all events in the desired order
        const sortedResult = [...tier1Events, ...tier2Events, ...regularEvents];

        // Apply time transformations after sorting
        sortedResult.forEach((item) => {
          item.day = timeTodayOfWeek(item.start_time);
          item.time = timeToAmPm(item.start_time);
        });

        setData(sortedResult);
        setAvailableFilters(sortFilters(sortedResult));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
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
      {isLoading ? (
        <div className="flex w-full justify-center text-white select-none">
          <div className="max-w-[1400px] grow flex flex-col gap-4">
            <div
              id="loading"
              className="border-[1px] border-white p-[4px] bg-black h-fit"
            >
              <div className="flex w-full justify-between items-center border-[1px] border-white p-[4px] sticky top-0 bg-black">
                <p className="w-full text-center text-xl uppercase text-white text-[1.65rem] font-[600] py-4">
                  Loading Amazing Events...
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : error === "showForm" ? (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/70"></div>
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="text-center text-white p-12 max-w-2xl">
              <div className="mb-8 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ENTER YOUR EMAIL TO ACCESS THE TECH WEEK 2025 CALENDAR
              </h2>
              <form className="mt-8 flex" onSubmit={(e) => submitForm(e)}>
                <input
                  id="email"
                  type="email"
                  placeholder="Register Email"
                  className="bg-white text-black p-3 flex-grow outline-none border-none"
                  onChange={(e) => validateEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className={`p-3 border border-white ${
                    isValidEmail
                      ? "bg-black text-white hover:bg-gray-900 cursor-pointer"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!isValidEmail}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : error === "incognito" ? (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/70"></div>
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="text-center text-white p-12 max-w-2xl">
              <div className="mb-8 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 16l2-7"></path>
                  <path d="M12 19h.01"></path>
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"></path>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ERROR DETECTED
              </h2>
              <p className="text-xl mb-6">
                Please disable incognito mode / allow cookies to access the
                calendar. Refresh the page to try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-black p-3 hover:bg-gray-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
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
                  //setCity={setCity}
                  currentCity={city}
                  city={"SF"}
                />
                <CitySelector
                  data={["LOS ANGELES", "OCT 13 - OCT 19"]}
                  //setCity={setCity}
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
      )}
    </div>
  );
};

export default App;
