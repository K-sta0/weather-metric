import { memo } from "react";
import type { AQIData } from "../types";

type AQIStyle = {
  label: string;
  color: string;
  bg: string;
  border: string;
  text: string;
};

const AQI_THRESHOLDS = [
  {
    max: 50,
    style: {
      label: "Good",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      text: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    },
  },
  {
    max: 100,
    style: {
      label: "Moderate",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      text: "Air quality is acceptable; however, there may be a risk for some people sensitive to air pollution.",
    },
  },
  {
    max: 150,
    style: {
      label: "Unhealthy for Sensitive",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    },
  },
  {
    max: 200,
    style: {
      label: "Unhealthy",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "Some members of the general public may experience health effects; sensitive groups may experience more serious effects.",
    },
  },
  {
    max: 300,
    style: {
      label: "Very Unhealthy",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "Health alert: The risk of health effects is increased for everyone.",
    },
  },
  {
    max: Infinity,
    style: {
      label: "Hazardous",
      color: "text-rose-900",
      bg: "bg-rose-900/10",
      border: "border-rose-900/20",
      text: "Health warning of emergency conditions: everyone is more likely to be affected.",
    },
  },
];

const POLLUTANT_INFO = {
  pm2_5: {
    name: "PM2.5",
    desc: "Fine particles (<2.5µm). Reaches deep into lungs. Main sources: vehicle exhaust, wildfires, power plants.",
  },
  pm10: {
    name: "PM10",
    desc: "Coarse particles (<10µm). Irritates eyes and throat. Main sources: construction dust, pollen, unpaved roads.",
  },
  no2: {
    name: "NO2",
    desc: "Nitrogen Dioxide. Causes lung inflammation. Main sources: burning fossil fuels, heavy traffic.",
  },
  o3: {
    name: "O3",
    desc: "Ground-level Ozone. Triggers asthma. Created by chemical reactions of pollutants in sunlight.",
  },
};

const getAQIStyle = (aqi: number): AQIStyle => {
  const match = AQI_THRESHOLDS.find((threshold) => aqi <= threshold.max);
  return match ? match.style : AQI_THRESHOLDS[AQI_THRESHOLDS.length - 1].style;
};

interface AirQualityProps {
  data: AQIData;
}

const AirQuality = memo(({ data }: AirQualityProps) => {
  const info = getAQIStyle(data.aqi);

  return (
    <div className="card w-full h-full bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 border border-white/10">
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
            {Object.entries(POLLUTANT_INFO).map(([key, infoData]) => {
              const value =
                data.components[key as keyof typeof data.components];
              const hasData = value > 0;

              return (
                <div key={key} className="relative group w-full">
                  <div className="bg-base-100/60 p-2 rounded-xl text-center shadow-sm cursor-help transition-all duration-200 group-hover:bg-base-100/80 group-hover:shadow-md">
                    <div className="text-[9px] font-bold text-base-content/50 uppercase tracking-wider mb-1">
                      {infoData.name}
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-base-content">
                      {hasData ? value : "--"}
                    </div>
                  </div>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="bg-base-100 p-3 rounded-xl shadow-2xl border border-base-200 text-xs text-left leading-relaxed">
                      <p className="font-bold text-base-content mb-1 border-b border-base-content/10 pb-1">
                        {" "}
                        {infoData.name}
                      </p>
                      <p className="text-base-content/80 font-normal">
                        {infoData.desc}
                      </p>
                      {!hasData && (
                        <p className="mt-2 text-[10px] text-error font-bold">
                          * Local sensor did not measure this parameter.
                        </p>
                      )}
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 border-[10px] border-transparent border-t-base-100 drop-shadow-md"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AirQuality;
