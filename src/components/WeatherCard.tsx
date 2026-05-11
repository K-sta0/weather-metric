import { type WeatherData } from "../types";

interface WeatherCardProps {
  weather: WeatherData | null;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <>
      {/* Weather card */}
      {/* Conditional rendering: If weather data exists, render the data. Otherwise, render the placeholder */}
      {weather ? (
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
      )}
    </>
  );
}
