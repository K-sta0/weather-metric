import { useState, useEffect } from "react";
import { type WeatherData } from "../types";
import { type MetricType } from "./WeatherChart";

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode.length !== 2) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

interface WeatherCardProps {
  weather: WeatherData;
  onMetricClick: (metric: MetricType) => void;
  activeMetric: MetricType;
  unit: "C" | "F";
}

export default function WeatherCard({
  weather,
  onMetricClick,
  activeMetric,
  unit,
}: WeatherCardProps) {
  const {
    name,
    sys,
    main,
    weather: weatherInfo,
    wind,
    timezone,
    coord,
  } = weather;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo[0].icon}@4x.png`;

  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    if (timezone === undefined) return;

    const updateClock = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const cityDate = new Date(utc + timezone * 1000);

      setLocalTime(
        cityDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  const displayTemp = () => {
    if (unit === "C") return Math.round(main.temp);
    return Math.round((main.temp * 9) / 5 + 32);
  };

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-md bg-opacity-80 transition-all">
      <div className="card-body items-center text-center p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-center">
            {name ? (
              <>
                {name}
                {sys.country && `, ${sys.country}`}
              </>
            ) : (
              <>
                {coord
                  ? `${coord.lat.toFixed(2)}°, ${coord.lon.toFixed(2)}°`
                  : "Unknown Location"}
              </>
            )}
          </span>
          {sys.country && (
            <span className="text-3xl sm:text-4xl leading-none drop-shadow-sm">
              {getFlagEmoji(sys.country)}
            </span>
          )}
        </h2>

        {localTime && (
          <div className="text-gray-500 font-medium mb-2 -mt-1">
            Local time:{" "}
            <span className="font-bold text-base-content">{localTime}</span>
          </div>
        )}

        <img
          src={iconUrl}
          alt={weatherInfo[0].description}
          className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md -my-4"
        />

        <div className="text-5xl sm:text-6xl font-bold text-base-content mb-1">
          {displayTemp()}°{unit}
        </div>

        <div className="text-lg sm:text-xl capitalize text-gray-500 mb-6 sm:mb-8 font-medium">
          {weatherInfo[0].description}
        </div>

        {/* Bottom bar */}
        <div className="flex w-full items-stretch bg-base-200/50 rounded-2xl border border-base-300/50 shadow-inner overflow-hidden mt-4">
          <button
            type="button"
            onClick={() =>
              onMetricClick(activeMetric === "humidity" ? null : "humidity")
            }
            className={`flex-1 flex flex-col items-center gap-1 py-4 px-2 border-r border-base-300/50 hover:bg-base-300/50 transition-colors duration-200 focus:outline-none ${activeMetric === "humidity" ? "bg-base-300/60 shadow-inner" : "bg-transparent"}`}
          >
            <span className="text-lg sm:text-xl" title="Humidity">
              💧
            </span>
            <span className="font-semibold text-sm text-base-content">
              {main.humidity}%
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Humidity
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              onMetricClick(activeMetric === "wind" ? null : "wind")
            }
            className={`flex-1 flex flex-col items-center gap-1 py-4 px-2 border-r border-base-300/50 hover:bg-base-300/50 transition-colors duration-200 focus:outline-none ${activeMetric === "wind" ? "bg-base-300/60 shadow-inner" : "bg-transparent"}`}
          >
            <span className="text-lg sm:text-xl" title="Wind Speed">
              💨
            </span>
            <span className="font-semibold text-sm text-base-content text-center leading-tight">
              {wind.speed} m/s
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Wind
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              onMetricClick(activeMetric === "pressure" ? null : "pressure")
            }
            className={`flex-1 flex flex-col items-center gap-1 py-4 px-2 hover:bg-base-300/50 transition-colors duration-200 focus:outline-none ${activeMetric === "pressure" ? "bg-base-300/60 shadow-inner" : "bg-transparent"}`}
          >
            <span className="text-lg sm:text-xl" title="Pressure">
              🌡️
            </span>
            <span className="font-semibold text-sm text-base-content text-center leading-tight">
              {main.pressure} hPa
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
              Pressure
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
