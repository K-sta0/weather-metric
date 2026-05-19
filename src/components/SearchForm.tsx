import { type FormEvent } from "react";
import { type CitySuggestion } from "../types";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onGeolocationClick: () => void;
  suggestions: CitySuggestion[];
  onSuggestionClick: (suggestion: CitySuggestion) => void;
  setSuggestions: (suggestions: CitySuggestion[]) => void;
}

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading,
  onGeolocationClick,
  suggestions,
  onSuggestionClick,
  setSuggestions,
}: SearchFormProps) {
  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
        {/* Wrapper for the input field and the absolute positioned dropdown */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter city name..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
          />

          {/* Render the dropdown menu only if there are suggestions available */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-base-100 rounded-box shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-base-200 cursor-pointer text-left flex items-center"
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  <img
                    src={`https://flagcdn.com/w20/${suggestion.country.toLowerCase()}.png`}
                    alt={suggestion.country}
                    className="w-5 h-auto mr-3 shadow-sm"
                  />

                  {/* Display City name, State (if available), and Country code */}
                  <div>
                    <span className="font-semibold">{suggestion.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {suggestion.state ? `${suggestion.state}, ` : ""}
                      {suggestion.country}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Search
        </button>
        <button
          type="button"
          className="btn bg-white hover:bg-gray-100 border-none text-xl shadow-lg"
          onClick={onGeolocationClick}
          disabled={isLoading}
          title="Get current location"
        >
          📍
        </button>
      </form>
    </>
  );
}
