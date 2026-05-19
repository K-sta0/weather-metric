import { useState, useEffect, useCallback } from "react";
import {
  type WeatherData,
  type CitySuggestion,
  type GeoapifyData,
} from "../types";

//Custom hook to manage weather data fetching and state
export function useWeather() {
  // We move all the state related to the API request here
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);

  const fetchWeather = async (city: string) => {
    if (city.trim() === "") return;

    setError(null);
    setIsLoading(true);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("City not found or API key not active yet");
      }

      const data = await response.json();
      localStorage.setItem("lastCity", city);
      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherByGeolocation = useCallback(
    async (lat: number, lon: number) => {
      // Reset error and start loading
      setError(null);
      setIsLoading(true);

      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

      try {
        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error("City not found or API key not active yet");
        }

        const data = await response.json();
        localStorage.setItem("lastLat", data.coord.lat.toString());
        localStorage.setItem("lastLon", data.coord.lon.toString());
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
        setWeather(null);
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

      // Deduplicate suggestions using a Set to prevent identical entries
      const uniqueSuggestions: CitySuggestion[] = [];
      const seen = new Set<string>();

      for (const item of formattedSuggestions) {
        if (!item.name || item.name === "Unknown") continue;

        // Create a unique fingerprint for the location (e.g., "Dresden-Saxony-DE")
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

  useEffect(() => {
    const savedLat = localStorage.getItem("lastLat");
    const savedLon = localStorage.getItem("lastLon");

    if (savedLat && savedLon) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWeatherByGeolocation(parseFloat(savedLat), parseFloat(savedLon));
    }
  }, [fetchWeatherByGeolocation]);

  // We return only what the UI needs to see and use
  return {
    weather,
    isLoading,
    error,
    fetchWeather,
    fetchWeatherByGeolocation,
    suggestions,
    setSuggestions,
    fetchCitySuggestions,
  };
}
