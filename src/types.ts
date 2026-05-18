// defining the exact shape of the data we expect from the API
export interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
}
export interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface GeoapifyData {
  city?: string;
  name?: string;
  lat: number;
  lon: number;
  country_code?: string;
  country: string;
  state?: string;
}
