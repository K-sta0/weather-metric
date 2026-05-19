import { memo, useMemo } from "react";
import { type WeatherData } from "../types";

interface WeatherBackgroundProps {
  weatherData: WeatherData | null;
}

const isNightTime = (iconCode?: string) =>
  iconCode ? iconCode.endsWith("n") : false;

const WeatherBackground = memo(({ weatherData }: WeatherBackgroundProps) => {
  const isNight = isNightTime(weatherData?.weather[0].icon);
  const mainCondition = weatherData?.weather[0].main.toLowerCase() || "";
  const description = weatherData?.weather[0].description.toLowerCase() || "";

  const isOvercast = description.includes("overcast");

  // Dynamic particle generation based on rain/snow intensity
  const rainDrops = useMemo(() => {
    const count = description.includes("heavy") ? 50 : 25;
    return Array.from({ length: count });
  }, [description]);

  const snowParticles = useMemo(() => Array.from({ length: 20 }), []);
  const stars = useMemo(() => Array.from({ length: 50 }), []);

  // Smart Cloud Generation based on description
  const clouds = useMemo(() => {
    let count = 5; // Default for scattered
    if (description.includes("few")) count = 3;
    else if (description.includes("broken")) count = 8;
    else if (isOvercast) count = 15; // Huge amount of clouds for overcast

    return Array.from({ length: count }).map(() => ({
      size: Math.random() * 200 + 100,
      top: `${Math.random() * 70}%`, // Position across the sky
      speed: `${Math.random() * 40 + 30}s`,
      delay: `-${Math.random() * 30}s`,
      // Overcast clouds are more opaque to block the background
      opacity: isNight ? (isOvercast ? 0.3 : 0.15) : isOvercast ? 0.9 : 0.6,
    }));
  }, [description, isNight, isOvercast]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000 bg-slate-900">
      {/* Night background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#0c0c20] to-[#1a1a40] transition-opacity duration-1000 ${isNight && !isOvercast ? "opacity-100" : "opacity-0"}`}
      />

      {/* Clear day background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-sky-400 to-amber-100 transition-opacity duration-1000 ${!isNight && mainCondition === "clear" ? "opacity-100" : "opacity-0"}`}
      />

      {/* Normal cloudy day background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-sky-300 to-slate-200 transition-opacity duration-1000 ${!isNight && mainCondition === "clouds" && !isOvercast ? "opacity-100" : "opacity-0"}`}
      />

      {/* Overcast day background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-400 to-gray-500 transition-opacity duration-1000 ${!isNight && mainCondition === "clouds" && isOvercast ? "opacity-100" : "opacity-0"}`}
      />

      {/* Overcast night background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 transition-opacity duration-1000 ${isNight && mainCondition === "clouds" && isOvercast ? "opacity-100" : "opacity-0"}`}
      />

      {/* Day rain background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-400 to-slate-600 transition-opacity duration-1000 ${!isNight && (mainCondition === "rain" || mainCondition === "drizzle") ? "opacity-100" : "opacity-0"}`}
      />

      {/* Night rain background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-[#1a1a40] transition-opacity duration-1000 ${isNight && (mainCondition === "rain" || mainCondition === "drizzle") ? "opacity-100" : "opacity-0"}`}
      />

      {/* Day snow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-100 to-slate-300 transition-opacity duration-1000 ${!isNight && mainCondition === "snow" ? "opacity-100" : "opacity-0"}`}
      />

      {/* Night snow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 transition-opacity duration-1000 ${isNight && mainCondition === "snow" ? "opacity-100" : "opacity-0"}`}
      />

      {/* Fog background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-300 to-slate-400 transition-opacity duration-1000 ${mainCondition === "mist" || mainCondition === "fog" ? "opacity-100" : "opacity-0"}`}
      />

      {/* Night: Static Stars (Hidden during rain, snow, mist, overcast) */}
      {isNight &&
        (mainCondition === "clear" ||
          (mainCondition === "clouds" && !isOvercast)) &&
        stars.map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

      {/* Clear day: Heat Haze Sun */}
      {!isNight && mainCondition === "clear" && (
        <div
          className="absolute top-10 right-10 md:top-20 md:right-32 w-48 h-48 animate-pulse"
          style={{ animationDuration: "4s" }}
        >
          <div className="absolute inset-0 bg-yellow-200 rounded-full blur-[20px]" />
          <div className="absolute -inset-10 bg-yellow-100 rounded-full blur-[80px] opacity-70 animate-[heatHaze_4s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Clouds: */}
      {mainCondition === "clouds" && (
        <div className="absolute inset-0 overflow-hidden">
          {clouds.map((c, i) => (
            <div
              key={`cloud-group-${i}`}
              className="cloud-particle absolute"
              style={{
                top: c.top,
                animationDuration: c.speed,
                animationDelay: c.delay,
                opacity: c.opacity,
                // Scale factor to take up massive space
                transform: `scale(${c.size / 120})`,
              }}
            >
              {/* Dynamic Composite Cloud: Made of blurred overlapping shapes for a fluffy look */}
              <div className="relative w-64 h-32">
                <div
                  className={`absolute left-10 top-4 w-40 h-24 rounded-full blur-2xl ${isNight ? "bg-gray-700" : "bg-white"}`}
                />
                <div
                  className={`absolute left-0 top-10 w-28 h-16 rounded-full blur-xl ${isNight ? "bg-gray-800" : "bg-gray-50"}`}
                />
                <div
                  className={`absolute left-28 top-8 w-32 h-20 rounded-full blur-xl ${isNight ? "bg-gray-600" : "bg-gray-100"}`}
                />
                <div
                  className={`absolute left-16 top-0 w-24 h-24 rounded-full blur-lg ${isNight ? "bg-slate-700" : "bg-white"}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rain, frizzle, thunderstorm */}
      {(mainCondition === "rain" ||
        mainCondition === "drizzle" ||
        mainCondition === "thunderstorm") && (
        <div>
          {rainDrops.map((_, i) => (
            <div
              key={`drop-${i}`}
              className="drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${description.includes("heavy") ? Math.random() * 0.5 + 0.4 : Math.random() * 0.5 + 0.7}s`,
                animationDelay: `${Math.random() * 0.8}s`,
                opacity: Math.random() * 0.5 + 0.3,
                height: `${Math.random() * 15 + 15}px`,
              }}
            />
          ))}
          {mainCondition === "thunderstorm" && (
            <div className="absolute inset-0 bg-white animate-[lightningFlash_10s_linear_infinite]" />
          )}
        </div>
      )}

      {/* Snow */}
      {mainCondition === "snow" && (
        <div>
          {snowParticles.map((_, i) => (
            <div
              key={`snow-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 2 + 3}s`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default WeatherBackground;
