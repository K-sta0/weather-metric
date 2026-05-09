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
  }>;
}
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
  }>;
}

function App() {
  // We store what the user is typing
  const [searchQuery, setSearchQuery] = useState("");
  // State to hold the successful API response
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Submission Handler
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery.trim() === "") return;

    console.log("Sending request to API for city:", searchQuery);

    //API fetch
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    // Construct the API endpoint URL
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`;

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
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation bar */}
      <div className="navbar bg-neutral text-neutral-content shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Weathermetric</a>
        </div>
      </div>

      {/* Main content container */}
      <main className="p-4 md:p-8 flex justify-center flex-col items-center gap-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
          <input
            type="text"
            placeholder="Enter city name..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Weather card */}
        {/* Conditional rendering: If weather data exists, render the data. Otherwise, render the placeholder */}
        {weather ? (
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
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
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-base-content/60">
                No city selected
              </h2>
              <p className="text-sm text-base-content/50">
                Use the search bar above to find the current weather.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
