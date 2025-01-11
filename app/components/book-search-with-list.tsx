import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { useFetcher } from "@remix-run/react";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { BookResult } from "~/types";
import BookResultCard from "./book-result-card";
import { useBooklist } from "./contexts/BooklistContext";

export function BookSearchWithListComponent({ listId }: { listId: string }) {
  const { bookList, setBookList } = useBooklist();
  const addToListFetcher = useFetcher();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookResult[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [emptyUrl, setEmptyUrl] = useState("/travolta.gif");

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      // TODO: add KV caching layer here
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}`
      );
      const data = (await response.json()) as {
        error?: { message: string };
        items?: BookResult[];
      };

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to search books");
      }

      setSearchResults(data.items || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching books:", error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const addToList = (book: BookResult) => {
    if (!bookList.some((item) => item.id === book.id)) {
      setBookList((prevList) => [...prevList, book]);

      addToListFetcher.submit(
        { book: JSON.stringify(book) },
        {
          method: "PUT",
          action: `/lists/${listId}/book`,
        }
      );
    } else {
      setBookList((prevList) => prevList.filter((item) => item.id !== book.id));
      // TODO: remove from list
    }
  };

  const handleClear = () => {
    setQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <>
      <div className="flex justify-between items-start mb-5">
        <div className="w-full text-center md:text-left">
          <h1 className="text-3xl font-bold text-secondary-foreground">
            Quickly create shareable book lists
          </h1>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="mb-6"
        id="book-search-form"
      >
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for books..."
              className="flex-grow"
              id="book-search-input"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-[0.2rem] top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit" disabled={isLoading} id="book-search-button">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {!hasSearched && !isLoading && (
        <div className="text-center py-4" id="book-search-empty-state">
          <img
            src={emptyUrl}
            alt="Where is everything?"
            loading="eager"
            onError={() => setEmptyUrl("/travolta.png")}
            style={{
              margin: "0 auto",
              maxWidth: "100%",
              height: "5rem",
            }}
          />
          <div className="max-w-md mx-auto p-4 rounded-lg">
            <p className="text-xs text-gray-600">
              Tip: Try searching for your favorite author or book title to get
              started
            </p>
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {searchResults.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center"
                id="book-search-result"
              >
                <BookResultCard
                  book={book}
                  addToList={addToList}
                  isAdded={bookList.some((item) => item.id === book.id)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {searchResults.length === 0 && hasSearched && !isLoading && (
        <p className="text-center text-gray-500">
          No books found. Try another search term.
        </p>
      )}
    </>
  );
}
