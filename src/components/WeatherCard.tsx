import { type WeatherData } from "../types";

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { name, sys, main, weather: weatherInfo, wind } = weather;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo[0].icon}@4x.png`;

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-md bg-opacity-80 transition-all">
      <div className="card-body items-center text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <span>
            {name}, {sys.country}
          </span>
          <span className="text-4xl leading-none drop-shadow-sm">
            {getFlagEmoji(sys.country)}
          </span>
        </h2>

        <img
          src={iconUrl}
          alt={weatherInfo[0].description}
          className="w-32 h-32 drop-shadow-md -my-4"
        />

        <div className="text-6xl font-bold text-base-content mb-1">
          {Math.round(main.temp)}°C
        </div>
        <div className="text-xl capitalize text-gray-500 mb-8 font-medium">
          {weatherInfo[0].description}
        </div>

        <div className="flex w-full justify-between items-center bg-base-200 rounded-box p-4 shadow-inner">
          <div className="flex flex-col items-center gap-1 w-1/3 border-r border-base-300">
            <span className="text-2xl" title="Humidity">
              💧
            </span>
            <span className="font-semibold text-base-content">
              {main.humidity}%
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Humidity
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 w-1/3 border-r border-base-300">
            <span className="text-2xl" title="Wind Speed">
              💨
            </span>
            <span className="font-semibold text-base-content">
              {wind.speed} m/s
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Wind
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 w-1/3">
            <span className="text-2xl" title="Pressure">
              🌡️
            </span>
            <span className="font-semibold text-base-content">
              {main.pressure} hPa
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Pressure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
