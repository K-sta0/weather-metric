import { memo } from "react";
import type { AQIData } from "../types";

type AQIStyle = {
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
};

const AQI_MAP: Record<number, AQIStyle> = {
  1: {
    label: "Good",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "Air quality is ideal for most individuals; enjoy your normal outdoor activities.",
  },
  2: {
    label: "Fair",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "Air quality is generally acceptable, but sensitive groups may experience minor symptoms.",
  },
  3: {
    label: "Moderate",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "Moderate air quality. People with respiratory issues should limit prolonged outdoor exertion.",
  },
  4: {
    label: "Poor",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "Poor air quality. Everyone may begin to feel health effects; avoid strenuous outdoor activities.",
  },
  5: {
    label: "Very Poor",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "Hazardous conditions. Everyone should avoid outdoor physical activities.",
  },
};

const DEFAULT_AQI: AQIStyle = {
  label: "Unknown",
  color: "text-gray-500",
  bg: "bg-gray-500/10",
  border: "border-gray-500/20",
  text: "Data unavailable.",
};

interface AirQualityProps {
  data: AQIData;
}

const AirQuality = memo(({ data }: AirQualityProps) => {
  const info = AQI_MAP[data.aqi] || DEFAULT_AQI;

  return (
    <div className="card w-full h-full bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 border border-white/20">
      <div className="card-body p-4 sm:p-6 flex flex-col justify-center">
        <h2 className="card-title text-lg sm:text-xl font-bold mb-3 text-base-content">
          Air Quality
        </h2>

        <div
          className={`p-4 sm:p-5 rounded-2xl flex flex-col h-full items-start justify-between gap-4 border ${info.bg} ${info.border}`}
        >
          <div className="flex-1 w-full">
            <div className="flex items-end gap-2 mb-1">
              <span
                className={`text-4xl sm:text-5xl font-black tracking-tighter leading-none ${info.color}`}
              >
                {data.aqi}
              </span>
              <span
                className={`text-lg sm:text-xl font-bold uppercase tracking-wide ${info.color}`}
              >
                {info.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-base-content/80 mt-2 leading-relaxed">
              {info.text}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full shrink-0 mt-auto">
            {["pm2_5", "pm10", "no2", "o3"].map((key) => (
              <div
                key={key}
                className="bg-base-100/60 p-2 rounded-xl text-center shadow-sm"
              >
                <div className="text-[9px] font-bold text-base-content/50 uppercase tracking-wider mb-1">
                  {key.replace("_", ".")}
                </div>
                <div className="font-extrabold text-xs sm:text-sm text-base-content">
                  {data.components[key as keyof typeof data.components].toFixed(
                    1,
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AirQuality;
