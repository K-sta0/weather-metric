import { useState, useEffect, useCallback, type FormEvent } from "react";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import { useWeather } from "./hooks/useWeather";
import { useDebounce } from "./hooks/useDebounce";
import { type CitySuggestion } from "./types";
import WeatherBackground from "./components/WeatherBackground";
import WeatherSkeleton from "./components/WeatherSkeleton";
import ForecastGrid from "./components/ForecastGrid";
import WeatherChart, { type MetricType } from "./components/WeatherChart";
import DaySummary from "./components/DaySummary";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import WeatherMap from "./components/WeatherMap";
import AirQuality from "./components/AirQuality";
import WelcomeScreen from "./components/WelcomeScreen";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [activeMetric, setActiveMetric] = useState<MetricType>(null);
  const [unit, setUnit] = useState<"C" | "F">(() => {
    return (localStorage.getItem("weatherUnit") as "C" | "F") || "C";
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [isDayTimeByDefault] = useState(() => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 20;
  });

  const {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchWeatherByGeolocation,
    suggestions,
    setSuggestions,
    fetchCitySuggestions,
    forecast,
    clearWeather,
    rawForecast,
    aqiData,
  } = useWeather();

  const handleMapClick = useCallback(
    (lat: number, lon: number) => {
      setSelectedDate(null);
      fetchWeatherByGeolocation(lat, lon);
    },
    [fetchWeatherByGeolocation],
  );

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    setSearchQuery("");
    setSuggestions([]);
    setSelectedDate(null);
    fetchWeatherByGeolocation(suggestion.lat, suggestion.lon, suggestion.name);
  };

  useEffect(() => {
    localStorage.setItem("weatherUnit", unit);
  }, [unit]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      fetchCitySuggestions(debouncedSearchQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (suggestions.length > 0) {
      const firstSuggestion = suggestions[0];
      setSearchQuery("");
      setSuggestions([]);
      setSelectedDate(null);
      fetchWeatherByGeolocation(
        firstSuggestion.lat,
        firstSuggestion.lon,
        firstSuggestion.name,
      );
      return;
    }

    if (searchQuery.trim().length > 0) {
      fetchWeather(searchQuery);
      setSearchQuery("");
      setSuggestions([]);
      setSelectedDate(null);
    }
  };

  const handleGeolocationClick = () => {
    setSelectedDate(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByGeolocation(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        (err) => {
          console.error("Error getting location:", err);
          alert("Please allow location access to use this feature.");
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    setActiveMetric(null);
    setSelectedDate(null);
    clearWeather();
  };

  return (
    <div className="min-h-screen relative z-0 flex flex-col">
      <WeatherBackground
        weatherData={weather}
        isDayByDefault={isDayTimeByDefault}
      />

      <div className="navbar bg-neutral text-neutral-content shadow-sm">
        <div className="flex-1">
          <a
            className="btn btn-ghost text-xl cursor-pointer"
            onClick={handleLogoClick}
          >
            Weathermetric
          </a>
        </div>

        <div className="flex-none bg-base-300/10 p-1 rounded-xl border border-white/10 flex items-center gap-1">
          <button
            onClick={() => setUnit("C")}
            className={`px-3 py-1 text-xs sm:text-sm font-extrabold rounded-lg transition-all duration-200 ${
              unit === "C"
                ? "bg-primary text-primary-content shadow-sm"
                : "text-neutral-content/60 hover:text-neutral-content"
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit("F")}
            className={`px-3 py-1 text-xs sm:text-sm font-extrabold rounded-lg transition-all duration-200 ${
              unit === "F"
                ? "bg-primary text-primary-content shadow-sm"
                : "text-neutral-content/60 hover:text-neutral-content"
            }`}
          >
            °F
          </button>
        </div>
      </div>

      <main className="p-4 md:p-8 flex justify-center flex-col items-center gap-4">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isLoading={isLoading}
          onGeolocationClick={handleGeolocationClick}
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          setSuggestions={setSuggestions}
        />

        {isLoading && <WeatherSkeleton />}

        {error && !isLoading && (
          <div className="alert alert-error max-w-md shadow-lg relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && !weather && (
          <WelcomeScreen onCitySelect={fetchWeather} />
        )}

        {!isLoading && !error && weather && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full flex flex-col items-center gap-4 mt-4"
          >
            <motion.div
              variants={itemVariants}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full flex flex-col"
              >
                <WeatherCard
                  weather={weather}
                  onMetricClick={setActiveMetric}
                  activeMetric={activeMetric}
                  unit={unit}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full h-full flex flex-col"
              >
                {aqiData && <AirQuality data={aqiData} />}
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {activeMetric && rawForecast && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full max-w-4xl overflow-hidden"
                >
                  <WeatherChart data={rawForecast} metric={activeMetric} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-4xl"
            >
              <WeatherMap
                lat={weather.coord.lat}
                lon={weather.coord.lon}
                city={weather.name}
                onMapClick={handleMapClick}
              />
            </motion.div>

            {forecast && forecast.length > 0 && (
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full max-w-4xl"
              >
                <ForecastGrid
                  data={forecast}
                  isLoading={isLoading}
                  unit={unit}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              </motion.div>
            )}

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-4xl"
            >
              <DaySummary
                date={selectedDate}
                rawForecast={rawForecast}
                unit={unit}
              />
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;
