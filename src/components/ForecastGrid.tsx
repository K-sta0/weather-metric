import { memo } from "react";
import { type DailyForecast } from "../types";

interface ForecastGridProps {
  data: DailyForecast[] | null;
  isLoading: boolean;
  unit: "C" | "F";
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const ForecastGrid = memo(
  ({
    data,
    isLoading,
    unit,
    selectedDate,
    onSelectDate,
  }: ForecastGridProps) => {
    if (isLoading || !data || data.length === 0) return null;

    const convertTemp = (celsius: number) => {
      if (unit === "C") return Math.round(celsius);
      return Math.round((celsius * 9) / 5 + 32);
    };

    return (
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 mt-6 mb-10 overflow-hidden border border-white/20">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold mb-4 sm:mb-6 justify-center sm:justify-start text-base-content">
            5-Day Forecast
          </h2>

          {/* Unified interactive container */}
          <div
            className="flex flex-row w-full bg-base-200/50 rounded-2xl border border-base-300/50 shadow-inner
                        overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
          >
            {data.map((day) => {
              const dateObj = new Date(day.date);
              const dayName = dateObj.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const monthDay = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              const isSelected = selectedDate === day.date;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => onSelectDate(isSelected ? null : day.date)}
                  className={`min-w-[105px] shrink-0 sm:min-w-0 sm:shrink flex-1 flex flex-col items-center py-5 px-1 sm:px-2
                           border-r border-base-300/50 last:border-r-0
                           transition-all duration-200 cursor-pointer focus:outline-none snap-start
                           ${
                             isSelected
                               ? "bg-base-300/60 shadow-inner"
                               : "bg-transparent hover:bg-base-300/50"
                           }`}
                >
                  <span className="font-extrabold text-base sm:text-xl uppercase tracking-tighter text-base-content">
                    {dayName}
                  </span>
                  <span className="text-[10px] sm:text-xs text-base-content/60 mb-2">
                    {monthDay}
                  </span>

                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@4x.png`}
                    alt="weather icon"
                    className="w-14 h-14 sm:w-20 sm:h-20 drop-shadow-md my-1"
                    draggable="false"
                  />

                  <div className="flex gap-2 sm:gap-4 mt-2 font-extrabold text-base sm:text-xl">
                    <span className="text-base-content" title="Max Temperature">
                      {convertTemp(day.temp_max)}°
                    </span>
                    <span
                      className="text-base-content/40"
                      title="Min Temperature"
                    >
                      {convertTemp(day.temp_min)}°
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

export default ForecastGrid;
