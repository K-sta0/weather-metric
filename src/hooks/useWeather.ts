import { useState, useEffect, useCallback } from "react";
import {
  type WeatherData,
  type CitySuggestion,
  type GeoapifyData,
  type ForecastItem,
  type DailyForecast,
} from "../types";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [rawForecast, setRawForecast] = useState<ForecastItem[] | null>(null);

  const processForecastData = (list: ForecastItem[]): DailyForecast[] => {
    const dailyData: Record<string, DailyForecast> = {};

    list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          icon: item.weather[0].icon.replace("n", "d"),
        };
      } else {
        if (item.main.temp_min < dailyData[date].temp_min) {
          dailyData[date].temp_min = item.main.temp_min;
        }
        if (item.main.temp_max > dailyData[date].temp_max) {
          dailyData[date].temp_max = item.main.temp_max;
        }
        if (item.dt_txt.includes("12:00:00")) {
          dailyData[date].icon = item.weather[0].icon.replace("n", "d");
        }
      }
    });

    return Object.values(dailyData).slice(0);
  };

  const fetchWeather = async (city: string) => {
    if (city.trim() === "") return;
    setError(null);
    setIsLoading(true);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(WEATHER_URL),
        fetch(FORECAST_URL),
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found or API key not active yet");
      }

      const weatherData = await weatherRes.json();
      const forecastRawData = await forecastRes.json();

      localStorage.setItem("lastCity", city);
      localStorage.removeItem("lastCustomName");

      setWeather(weatherData);
      setForecast(processForecastData(forecastRawData.list));
      setRawForecast(forecastRawData.list);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByGeolocation = useCallback(
    async (lat: number, lon: number, customName?: string) => {
      setError(null);
      setIsLoading(true);

      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(WEATHER_URL),
          fetch(FORECAST_URL),
        ]);

        if (!weatherRes.ok || !forecastRes.ok) {
          throw new Error("City not found or API key not active yet");
        }

        const weatherData = await weatherRes.json();
        const forecastRawData = await forecastRes.json();

        if (customName) {
          weatherData.name = customName;
          localStorage.setItem("lastCustomName", customName);
        }

        localStorage.setItem("lastLat", weatherData.coord.lat.toString());
        localStorage.setItem("lastLon", weatherData.coord.lon.toString());

        setWeather(weatherData);
        setForecast(processForecastData(forecastRawData.list));
        setRawForecast(forecastRawData.list);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
        setWeather(null);
        setForecast(null);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchCitySuggestions = async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const API_KEY = import.meta.env.VITE_GEOAPIFY_KEY;
    const URL = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=locality&limit=5&format=json&apiKey=${API_KEY}`;

    try {
      const response = await fetch(URL);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      const formattedSuggestions = data.results.map((item: GeoapifyData) => ({
        name: item.city || item.name || "Unknown",
        lat: item.lat,
        lon: item.lon,
        country: item.country_code
          ? item.country_code.toUpperCase()
          : item.country,
        state: item.state,
      }));

      const uniqueSuggestions: CitySuggestion[] = [];
      const seen = new Set<string>();

      for (const item of formattedSuggestions) {
        if (!item.name || item.name === "Unknown") continue;
        const uniqueKey = `${item.name}-${item.state || ""}-${item.country}`;

        if (!seen.has(uniqueKey)) {
          seen.add(uniqueKey);
          uniqueSuggestions.push(item);
        }
        if (uniqueSuggestions.length === 5) break;
      }
      setSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const clearWeather = useCallback(() => {
    setWeather(null);
    setForecast(null);
    setRawForecast(null);
    setError(null);
    setSuggestions([]);

    localStorage.removeItem("lastCity");
    localStorage.removeItem("lastLat");
    localStorage.removeItem("lastLon");
    localStorage.removeItem("lastCustomName");
  }, []);

  useEffect(() => {
    const savedLat = localStorage.getItem("lastLat");
    const savedLon = localStorage.getItem("lastLon");
    const savedCustomName = localStorage.getItem("lastCustomName");

    if (savedLat && savedLon) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWeatherByGeolocation(
        parseFloat(savedLat),
        parseFloat(savedLon),
        savedCustomName || undefined,
      );
    }
  }, [fetchWeatherByGeolocation]);

  return {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchWeatherByGeolocation,
    suggestions,
    setSuggestions,
    fetchCitySuggestions,
    forecast,
    rawForecast,
    clearWeather,
  };
}
