import { useState, useEffect, type FormEvent } from "react";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import { useWeather } from "./hooks/useWeather";
import { useDebounce } from "./hooks/useDebounce";
import { type CitySuggestion } from "./types.ts";
import WeatherBackground from "./components/WeatherBackground";
import WeatherSkeleton from "./components/WeatherSkeleton";
import ForecastGrid from "./components/ForecastGrid.tsx";
import WeatherChart, { type MetricType } from "./components/WeatherChart";
import DaySummary from "./components/DaySummary";
import { AnimatePresence, motion } from "framer-motion";
import WeatherMap from "./components/WeatherMap";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [activeMetric, setActiveMetric] = useState<MetricType>(null);
  const [unit, setUnit] = useState<"C" | "F">(() => {
    return (localStorage.getItem("weatherUnit") as "C" | "F") || "C";
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    setSearchQuery("");
    setSuggestions([]);
    setSelectedDate(null);
    fetchWeatherByGeolocation(suggestion.lat, suggestion.lon, suggestion.name);
  };

  useEffect(() => {
    localStorage.setItem("weatherUnit", unit);
  }, [unit]);

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
  } = useWeather();

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
      <WeatherBackground weatherData={weather} />

      {/* Navigation bar */}
      <div className="navbar bg-neutral text-neutral-content shadow-sm">
        <div className="flex-1">
          <a
            className="btn btn-ghost text-xl cursor-pointer"
            onClick={handleLogoClick}
          >
            Weathermetric
          </a>
        </div>

        {/* Temperature toggle switch */}
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

      {/* Main content container */}
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

        {/* Show Skeleton */}
        {isLoading && <WeatherSkeleton />}

        {/* Show Error Message */}
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

        {/* Empty state card */}
        {!isLoading && !error && !weather && (
          <div className="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-md bg-opacity-80 mt-4">
            <div className="card-body items-center text-center py-10">
              <span className="text-6xl mb-4">🌍</span>
              <h2 className="card-title text-2xl font-bold">
                Welcome to Weathermetric
              </h2>
              <p className="text-gray-500 mt-2">
                Enter a city name above or click the location pin 📍 to get the
                current weather.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && weather && (
          <WeatherCard
            weather={weather}
            onMetricClick={setActiveMetric}
            activeMetric={activeMetric}
            unit={unit}
          />
        )}

        {!isLoading && !error && weather && (
          <WeatherMap
            lat={weather.coord.lat}
            lon={weather.coord.lon}
            city={weather.name}
          />
        )}

        <AnimatePresence>
          {!isLoading && !error && activeMetric && rawForecast && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 8 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full max-w-md overflow-hidden"
            >
              <WeatherChart data={rawForecast} metric={activeMetric} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && !error && forecast && forecast.length > 0 && (
          <ForecastGrid
            data={forecast}
            isLoading={isLoading}
            unit={unit}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}

        {/* Detailed summary component */}
        <DaySummary date={selectedDate} rawForecast={rawForecast} unit={unit} />
      </main>
    </div>
  );
}

export default App;
