import { memo } from "react";
import { type ForecastItem } from "../types";
import { AnimatePresence, motion } from "framer-motion";

interface DaySummaryProps {
  date: string | null;
  rawForecast: ForecastItem[] | null;
  unit: "C" | "F";
}

const DaySummary = memo(({ date, rawForecast, unit }: DaySummaryProps) => {
  if (!date || !rawForecast) return null;

  const dayData = rawForecast.filter((item) => item.dt_txt.startsWith(date));

  if (dayData.length === 0) return null;

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const convertTemp = (celsius: number) => {
    if (unit === "C") return Math.round(celsius);
    return Math.round((celsius * 9) / 5 + 32);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -20, height: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mt-2 mb-8"
      >
        <div className="card bg-base-100/90 shadow-xl backdrop-blur-md border border-base-300/50">
          <div className="card-body p-4 sm:p-6">
            <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
              <span>🕒</span> Hourly Details for {formattedDate}
            </h3>

            <div className="flex flex-col gap-2 sm:gap-3">
              {dayData.map((item) => {
                const time = new Date(item.dt_txt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={item.dt_txt}
                    className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-base-200/80 border border-base-300 shadow-sm hover:bg-base-300/80 transition-colors"
                  >
                    {/* Time */}
                    <div className="w-12 sm:w-16 text-sm sm:text-base font-bold text-base-content/80">
                      {time}
                    </div>

                    {/* Temperature */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                        className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm"
                      />
                      <span className="text-xl sm:text-2xl font-extrabold text-base-content w-10 sm:w-12 text-left">
                        {convertTemp(item.main.temp)}°
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col items-end w-32 sm:w-40">
                      <span className="text-xs sm:text-sm font-bold capitalize text-base-content/80 text-right leading-tight mb-1.5">
                        {item.weather[0].description}
                      </span>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] sm:text-xs text-purple-500 font-bold flex items-center gap-1.5">
                          <span title="Wind" className="text-sm">
                            💨
                          </span>
                          {Math.round(item.wind.speed)} m/s
                        </span>
                        <span className="text-[10px] sm:text-xs text-blue-500 font-bold flex items-center gap-1.5">
                          <span title="Humidity" className="text-sm">
                            💧
                          </span>
                          {item.main.humidity}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default DaySummary;
