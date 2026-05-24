import { memo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { type ForecastItem } from "../types";

export type MetricType = "humidity" | "wind" | "pressure" | null;

interface WeatherChartProps {
  data: ForecastItem[] | null;
  metric: MetricType;
}

const formatXAxis = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
};

const metricConfig = {
  humidity: {
    key: "main.humidity",
    color: "#3b82f6",
    label: "Humidity",
    unit: "%",
  },
  wind: {
    key: "wind.speed",
    color: "#8b5cf6",
    label: "Wind Speed",
    unit: "m/s",
  },
  pressure: {
    key: "main.pressure",
    color: "#f59e0b",
    label: "Pressure",
    unit: "hPa",
  },
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-base-200 text-center">
        <p className="font-bold text-sm mb-1">{label}</p>
        <p
          className="font-extrabold text-lg"
          style={{ color: payload[0].stroke }}
        >
          {payload[0].value} {unit}
        </p>
      </div>
    );
  }
  return null;
};

const WeatherChart = memo(({ data, metric }: WeatherChartProps) => {
  if (!data || !metric) return null;

  const chartData = data.slice(0, 8).map((item) => ({
    time: item.dt_txt,
    "main.humidity": item.main.humidity,
    "wind.speed": item.wind.speed,
    "main.pressure": item.main.pressure,
  }));

  const config = metricConfig[metric];

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 mt-2 border border-white/20">
      <div className="card-body p-4 sm:p-6">
        <h3 className="font-bold text-lg mb-4 text-base-content capitalize">
          24h {config.label} Forecast
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`color-${metric}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              content={<CustomTooltip unit={config.unit} />}
              cursor={{ stroke: "currentColor", opacity: 0.2 }}
            />
            <Area
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color-${metric})`}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default WeatherChart;
