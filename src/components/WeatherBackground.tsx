import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { type WeatherData } from "../types";
import CitySkyline from "./CitySkyline";

interface WeatherBackgroundProps {
  weatherData: WeatherData | null;
  isDayByDefault?: boolean;
}

const isNightTime = (iconCode?: string) =>
  iconCode ? iconCode.endsWith("n") : false;

const GRADIENTS: Record<string, string> = {
  "night-clear": "from-[#0c0c20] to-[#1a1a40]",
  "day-clear": "from-sky-500 via-sky-300 to-sky-200",
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

const WeatherBackground = memo(
  ({ weatherData, isDayByDefault }: WeatherBackgroundProps) => {
    const isNight = isNightTime(weatherData?.weather[0].icon);
    const mainCondition = weatherData?.weather[0].main.toLowerCase() || "";
    const description = weatherData?.weather[0].description.toLowerCase() || "";
    const isOvercast = description.includes("overcast");

    const activeTheme = getActiveTheme(mainCondition, isNight, isOvercast);

    const baseBg = !weatherData
      ? isDayByDefault
        ? "bg-sky-300"
        : "bg-slate-900"
      : isNight
        ? "bg-slate-900"
        : "bg-sky-300";

    const showStarsWeather =
      isNight &&
      (mainCondition === "clear" ||
        (mainCondition === "clouds" && !isOvercast));
    const showStarsWelcome = !weatherData && !isDayByDefault;
    const renderStars = showStarsWeather || showStarsWelcome;

    const rainDrops = useMemo(
      () => Array.from({ length: description.includes("heavy") ? 50 : 25 }),
      [description],
    );
    const snowParticles = useMemo(() => Array.from({ length: 20 }), []);
    const stars = useMemo(() => Array.from({ length: 50 }), []);

    const clouds = useMemo(() => {
      const count = description.includes("few")
        ? 3
        : description.includes("broken")
          ? 8
          : isOvercast
            ? 15
            : 5;
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
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${!weatherData ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`absolute inset-0 bg-linear-to-br transition-opacity duration-1000 ${isDayByDefault ? GRADIENTS["day-clear"] : GRADIENTS["night-clear"]}`}
          />
          {!isDayByDefault && (
            <>
              <div
                className="absolute w-160 h-160 rounded-full blur-[120px] animate-pulse bg-blue-500/20 top-[20%] left-[10%]"
                style={{ animationDuration: "8s" }}
              />
              <div
                className="absolute w-160 h-160 rounded-full blur-[120px] animate-pulse bg-purple-500/20 bottom-[20%] right-[10%]"
                style={{ animationDuration: "12s", animationDelay: "2s" }}
              />
            </>
          )}

          {isDayByDefault && (
            <>
              <div
                className="absolute top-10 right-10 md:top-20 md:right-32 w-64 h-64 bg-yellow-300/80 rounded-full blur-[60px] animate-pulse z-0"
                style={{ animationDuration: "6s" }}
              />
              <div className="absolute top-0 right-0 md:top-10 md:right-20 w-96 h-96 bg-amber-300/40 rounded-full blur-[100px] z-0" />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-amber-200/10 to-transparent z-0" />
              <div className="absolute w-full h-[35vh] bottom-0 bg-gradient-to-t from-amber-200/40 to-transparent z-0" />
            </>
          )}

          <CitySkyline isVisible={!weatherData} isNight={!isDayByDefault} />
        </div>

        {Object.entries(GRADIENTS).map(([themeKey, gradientClasses]) => (
          <div
            key={themeKey}
            className={`absolute inset-0 bg-linear-to-br ${gradientClasses} transition-opacity duration-1000 ${activeTheme === themeKey ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {renderStars &&
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
          <>
            <div
              className="absolute top-10 right-10 md:top-20 md:right-32 w-48 h-48 animate-pulse"
              style={{ animationDuration: "4s" }}
            >
              <div className="absolute inset-0 bg-yellow-100 rounded-full blur-[20px]" />
              <div className="absolute -inset-10 bg-amber-300/60 rounded-full blur-[80px] opacity-70 animate-[heatHaze_4s_ease-in-out_infinite]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-300/40 via-amber-200/10 to-transparent z-0 pointer-events-none" />
            <div className="absolute w-full h-[35vh] bottom-0 bg-gradient-to-t from-amber-100/40 to-transparent z-0 pointer-events-none" />
          </>
        )}

        {mainCondition === "clouds" && (
          <div className="absolute inset-0 overflow-hidden">
            {clouds.map((c, i) => (
              <motion.div
                key={`cloud-group-${i}`}
                className="absolute"
                style={{ top: c.top, opacity: c.opacity, scale: c.size / 120 }}
                initial={{ x: "-400px" }}
                animate={{ x: "120vw" }}
                transition={{
                  duration: c.speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: c.delay,
                }}
              >
                {" "}
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
  },
);

export default WeatherBackground;
