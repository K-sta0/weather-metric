import { useState, type FormEvent } from "react";
import SearchForm from "./components/SearchForm";
import WeatherCard from "./components/WeatherCard";
import { useWeather } from "./hooks/useWeather";

// Function to choose the background color based on weather conditions
const getBackgroundClass = (weatherCondition?: string) => {
  if (!weatherCondition) return "bg-base-200"; // Default background

  // We use Tailwind gradients for a modern look
  switch (weatherCondition.toLowerCase()) {
    case "clear":
      return "bg-gradient-to-br from-blue-400 to-sky-200";
    case "clouds":
      return "bg-gradient-to-br from-gray-300 to-gray-100";
    case "rain":
    case "drizzle":
      return "bg-gradient-to-br from-slate-700 to-slate-500";
    case "snow":
      return "bg-gradient-to-br from-blue-100 to-white";
    case "thunderstorm":
      return "bg-gradient-to-br from-gray-900 to-gray-700";
    default:
      return "bg-gradient-to-br from-indigo-100 to-base-200";
  }
};

function App() {
  // We store what user is typing right now
  const [searchQuery, setSearchQuery] = useState("");

  // We use our custom hook
  const { weather, isLoading, error, fetchWeather, fetchWeatherByGeolocation } =
    useWeather();
  useWeather();

  // Simplified submission handler
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchWeather(searchQuery); // Pass the city to the hook
    setSearchQuery(""); // Clear the input field
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
          // Если пользователь запретил доступ или произошла ошибка
          console.error("Error getting location:", err);
          alert("Please allow location access to use this feature.");
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        weather ? getBackgroundClass(weather.weather[0].main) : "bg-base-200"
      }`}
    >
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

        {/* Render Weather Card Component ONLY if not loading and no error */}
        {!isLoading && !error && <WeatherCard weather={weather} />}
      </main>
    </div>
  );
}

export default App;
