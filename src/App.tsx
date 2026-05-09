import { useState, type FormEvent } from "react";

function App() {
  // We store what the user is typing
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-gray-400">No city selected</h2>
            <p className="text-sm text-gray-500">
              Use the search bar above to find the current weather
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
