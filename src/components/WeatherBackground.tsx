import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { type WeatherData } from "../types";

interface WeatherBackgroundProps {
  weatherData: WeatherData | null;
}

const isNightTime = (iconCode?: string) =>
  iconCode ? iconCode.endsWith("n") : false;

const GRADIENTS: Record<string, string> = {
  "night-clear": "from-[#0c0c20] to-[#1a1a40]",
  "day-clear": "from-sky-400 to-amber-100",
  "day-cloudy": "from-sky-300 to-slate-200",
  "day-overcast": "from-slate-400 to-gray-500",
  "night-overcast": "from-gray-800 to-gray-950",
  "day-rain": "from-slate-400 to-slate-600",
  "night-rain": "from-slate-800 to-[#1a1a40]",
  "day-snow": "from-blue-100 to-slate-300",
  "night-snow": "from-slate-800 to-slate-950",
  fog: "from-gray-300 to-slate-400",
};

const getActiveTheme = (
  main: string,
  isNight: boolean,
  isOvercast: boolean,
): string | null => {
  if (!main) return null;
  if (main === "mist" || main === "fog") return "fog";
  if (["rain", "drizzle", "thunderstorm"].includes(main))
    return isNight ? "night-rain" : "day-rain";
  if (main === "snow") return isNight ? "night-snow" : "day-snow";
  if (isOvercast) return isNight ? "night-overcast" : "day-overcast";
  if (main === "clouds") return isNight ? "night-clear" : "day-cloudy";
  return isNight ? "night-clear" : "day-clear";
};

const WeatherBackground = memo(({ weatherData }: WeatherBackgroundProps) => {
  const isNight = isNightTime(weatherData?.weather[0].icon);
  const mainCondition = weatherData?.weather[0].main.toLowerCase() || "";
  const description = weatherData?.weather[0].description.toLowerCase() || "";
  const isOvercast = description.includes("overcast");

  const activeTheme = getActiveTheme(mainCondition, isNight, isOvercast);

  const baseBg = !weatherData
    ? "bg-slate-800"
    : isNight
      ? "bg-slate-900"
      : "bg-slate-300";

  const rainDrops = useMemo(() => {
    const count = description.includes("heavy") ? 50 : 25;
    return Array.from({ length: count });
  }, [description]);

  const snowParticles = useMemo(() => Array.from({ length: 20 }), []);
  const stars = useMemo(() => Array.from({ length: 50 }), []);

  const clouds = useMemo(() => {
    let count = 5;
    if (description.includes("few")) count = 3;
    else if (description.includes("broken")) count = 8;
    else if (isOvercast) count = 15;

    return Array.from({ length: count }).map(() => ({
      size: Math.random() * 200 + 100,
      top: `${Math.random() * 70}%`,
      speed: Math.random() * 40 + 30,
      delay: -(Math.random() * 30),
      opacity: isNight ? (isOvercast ? 0.3 : 0.15) : isOvercast ? 0.9 : 0.6,
    }));
  }, [description, isNight, isOvercast]);

  return (
    <div
      className={`fixed inset-0 z-[-1] overflow-hidden pointer-events-none transition-colors duration-1000 ${baseBg}`}
    >
      {Object.entries(GRADIENTS).map(([themeKey, gradientClasses]) => (
        <div
          key={themeKey}
          className={`absolute inset-0 bg-gradient-to-br ${gradientClasses} transition-opacity duration-1000 ${
            activeTheme === themeKey ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

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

      {!isNight && mainCondition === "clear" && (
        <div
          className="absolute top-10 right-10 md:top-20 md:right-32 w-48 h-48 animate-pulse"
          style={{ animationDuration: "4s" }}
        >
          <div className="absolute inset-0 bg-yellow-200 rounded-full blur-[20px]" />
          <div className="absolute -inset-10 bg-yellow-100 rounded-full blur-[80px] opacity-70 animate-[heatHaze_4s_ease-in-out_infinite]" />
        </div>
      )}

      {mainCondition === "clouds" && (
        <div className="absolute inset-0 overflow-hidden">
          {clouds.map((c, i) => (
            <motion.div
              key={`cloud-group-${i}`}
              className="absolute"
              style={{
                top: c.top,
                opacity: c.opacity,
                scale: c.size / 120,
              }}
              initial={{ x: "-400px" }}
              animate={{ x: "120vw" }}
              transition={{
                duration: c.speed,
                repeat: Infinity,
                ease: "linear",
                delay: c.delay,
              }}
            >
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
            </motion.div>
          ))}
        </div>
      )}

      {["rain", "drizzle", "thunderstorm"].includes(mainCondition) && (
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
