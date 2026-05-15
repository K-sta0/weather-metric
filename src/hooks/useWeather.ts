import { useState, useEffect } from "react";
import { type WeatherData, type CitySuggestion } from "../types";

//Custom hook to manage weather data fetching and state
export function useWeather() {
  // We move all the state related to the API request here
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);

  // This function takes a city name and does all the hard work
  const fetchWeather = async (city: string) => {
    if (city.trim() === "") return;

    // Reset error and start loading
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

  const fetchWeatherByGeolocation = async (lat: number, lon: number) => {
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

  const fetchCitySuggestions = async (query: string) => {
    // Do not fetch if the query is too short
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;

    try {
      const response = await fetch(URL);
      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const savedCity = localStorage.getItem("lastCity");
    if (savedCity !== null) {
      setTimeout(() => {
        fetchWeather(savedCity);
      }, 0);
    }
  }, []);

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
