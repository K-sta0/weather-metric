import { useState, useEffect, type FormEvent } from "react";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import { useWeather } from "./hooks/useWeather";
import { useDebounce } from "./hooks/useDebounce";
import { type CitySuggestion } from "./types.ts";
import WeatherBackground from "./components/WeatherBackground";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    setSearchQuery("");
    setSuggestions([]);
    fetchWeatherByGeolocation(suggestion.lat, suggestion.lon, suggestion.name);
  };

  const {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchWeatherByGeolocation,
    suggestions,
    setSuggestions,
    fetchCitySuggestions,
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
      fetchWeatherByGeolocation(
        firstSuggestion.lat,
        firstSuggestion.lon,
        firstSuggestion.name,
      );
      return;
    }

    // If no suggestions, proceed with the standard string-based search
    if (searchQuery.trim().length > 0) {
      fetchWeather(searchQuery);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleGeolocationClick = () => {
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

  return (
    <div className="min-h-screen relative z-0 flex flex-col">
      <WeatherBackground weatherData={weather} />
      {/* Navigation bar */}
      <div className="navbar bg-neutral text-neutral-content shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Weathermetric</a>
        </div>
      </div>

      {/* Main content container */}
      <main className="p-4 md:p-8 flex justify-center flex-col items-center gap-4">
        {/* Render Search Form Component */}
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

        {/* Show Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center p-10 w-full max-w-md">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

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

        {/* Render Weather Card Component ONLY if not loading and no error */}
        {!isLoading && !error && weather && <WeatherCard weather={weather} />}
      </main>
    </div>
  );
}

export default App;
