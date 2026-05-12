import { type FormEvent } from "react";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onGeolocationClick: () => void;
}

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading,
  onGeolocationClick,
}: SearchFormProps) {
  return (
    <>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
        <input
          type="text"
          placeholder="Enter city name..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Search
        </button>
        <button
          type="button"
          className="btn bg-white hover:bg-gray-100 border-none text-xl"
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
