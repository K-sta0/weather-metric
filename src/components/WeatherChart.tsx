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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    stroke: string;
  }>;
  label?: string;
  unit: string;
}

const formatXAxis = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const metricConfig = {
  humidity: {
    key: "main.humidity",
    color: "#3b82f6",
    label: "Humidity",
    unit: "%",
    yAxisWidth: 35,
  },
  wind: {
    key: "wind.speed",
    color: "#8b5cf6",
    label: "Wind Speed",
    unit: "m/s",
    yAxisWidth: 45,
  },
  pressure: {
    key: "main.pressure",
    color: "#f59e0b",
    label: "Pressure",
    unit: "hPa",
    yAxisWidth: 60,
  },
};

const CustomTooltip = ({
  active,
  payload,
  label,
  unit,
}: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const dateObj = new Date(label);

    const dayName = dateObj.toLocaleString("en-GB", { weekday: "short" });
    const dayMonth = dateObj.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const time = dateObj.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const formattedDate = `${dayName}, ${dayMonth}, ${time}`;

    return (
      <div className="bg-base-100/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-base-200 text-center">
        <p className="font-bold text-sm mb-1 text-base-content/70">
          {formattedDate}
        </p>
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
    <div className="card w-full bg-base-100 shadow-xl backdrop-blur-md bg-opacity-90 mt-2 border border-white/20">
      <div className="card-body p-4 sm:p-6">
        <h3 className="font-bold text-lg mb-4 text-base-content capitalize">
          24h {config.label} Forecast
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`color${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              strokeOpacity={0.15}
            />

            <XAxis
              dataKey="time"
              tickFormatter={formatXAxis}
              tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{ fill: "currentColor", opacity: 0.5, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              domain={["auto", "auto"]}
              width={config.yAxisWidth}
            />
            <Tooltip content={<CustomTooltip unit={config.unit} />} />
            <Area
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color${metric})`}
              activeDot={{
                r: 6,
                fill: config.color,
                stroke: "var(--fallback-b1,oklch(var(--b1)))",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default WeatherChart;
