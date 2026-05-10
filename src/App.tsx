import { useState, type FormEvent } from "react";
// defining the exact shape of the data we expect from the API
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
}

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
  // We store what the user is typing
  const [searchQuery, setSearchQuery] = useState("");
  // State to hold the successful API response
  const [weather, setWeather] = useState<WeatherData | null>(null);
  // Boolean state to track if the request is in progress
  const [isLoading, setIsLoading] = useState(false);
  // String state to store error messages
  const [error, setError] = useState<string | null>(null);

  // Submission Handler
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim() === "") return;

    console.log("Sending request to API for city:", searchQuery);

    //API fetch
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    // Construct the API endpoint URL
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`;

    // Reset error and start loading
    setError(null);
    setIsLoading(true);

    try {
      console.log("Sending request to:", URL);
      // Execute the HTTP GET request and wait for the response
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("City not found or API key not active yet");
      }

      const data = await response.json();
      console.log("Weather Data:", data);

      // Save the data to React state and clear the search input
      setWeather(data);
      setSearchQuery("");
    } catch (error) {
      console.error("Error fetching weather:", error);
      if (error instanceof Error) {
        // Save the error message to display it in UI
        setError(error.message);
      } else {
        // Fallback for unexpected error types that aren't standard Error objects
        setError("An unexpected error occurred");
      }

      setWeather(null);
    } finally {
      setIsLoading(false);
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
        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
          <input
            type="text"
            placeholder="Enter city name..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            Search
          </button>
        </form>

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

        {/* Weather card */}
        {/* Conditional rendering: If weather data exists, render the data. Otherwise, render the placeholder */}
        {/* Show Weather Card OR Placeholder (only if not loading) */}
        {!isLoading &&
          !error &&
          (weather ? (
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
              <div className="card-body items-center text-center">
                <h2 className="card-title text-3xl">{weather.name}</h2>

                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                  alt="weather icon"
                  className="w-32 h-32 drop-shadow-lg"
                />

                <p className="text-5xl font-bold text-base-content">
                  {Math.round(weather.main.temp)}°C
                </p>

                <p className="text-lg capitalize text-base-content/80">
                  {weather.weather[0].description}
                </p>

                <div className="flex gap-4 mt-4 text-sm text-base-content/60">
                  <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
                  <p>Humidity: {weather.main.humidity}%</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
              <div className="card-body items-center text-center">
                <h2 className="card-title text-base-content/60">
                  No city selected
                </h2>
                <p className="text-sm text-base-content/50">
                  Use the search bar above to find the current weather.
                </p>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}

export default App;
