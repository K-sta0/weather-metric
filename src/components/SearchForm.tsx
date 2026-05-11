import { type FormEvent } from "react";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isLoading,
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
      </form>
    </>
  );
}
