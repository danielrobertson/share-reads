import { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";
import {
  SearchField,
  SearchFieldClear,
  SearchFieldInput,
} from "~/components/ui/searchfield";

import { useGoogleBooks } from "~/hooks/useGoogleBooks";
import BookResultCard from "./book-result-card";

export function BookSearch() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");

  const { data: searchResults, isLoading } = useGoogleBooks({ query });
  console.log("🚀 ~ BookSearch ~ searchResults:", searchResults);

  const [emptyUrl, setEmptyUrl] = useState("/travolta.gif");

  const addToList = () => {
    alert("TODO add to list");
  };

  return (
    <div className="h-full mt-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(value);
        }}
        className="mb-6 max-w-lg mx-auto"
        id="book-search-form"
      >
        <div className="flex gap-2">
          <div className="relative w-full">
            <SearchField className="">
              <FieldGroup>
                <SearchIcon
                  aria-hidden
                  className="size-4 text-muted-foreground"
                />
                <SearchFieldInput
                  placeholder="Search for books..."
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full"
                  id="book-search-input"
                  aria-label="Search"
                />
                <SearchFieldClear
                  onPress={() => {
                    setQuery("");
                    setValue("");
                  }}
                >
                  <XIcon aria-hidden className="size-4" />
                </SearchFieldClear>
              </FieldGroup>
            </SearchField>
          </div>
          <Button
            className="h-10"
            type="submit"
            disabled={isLoading}
            id="book-search-button"
          >
            Search
          </Button>
        </div>
      </form>

      {!searchResults && !isLoading && (
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
            <p className="text-xs text-muted-foreground">
              Tip: Try searching for your favorite author or book title to get
              started
            </p>
          </div>
        </div>
      )}

      {searchResults?.items && searchResults?.items?.length > 0 && (
        <>
          <h2 className="font-semibold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {searchResults.items.map((book) => (
              <li
                key={book.id}
                className="flex justify-between items-center"
                id="book-search-result"
              >
                <BookResultCard
                  book={book}
                  addToList={addToList}
                  // isAdded={bookList.some((item) => item.id === book.id)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {query &&
        searchResults &&
        searchResults?.totalItems === 0 &&
        !isLoading && (
          <p className="text-center text-xs text-muted-foreground">
            No books found. Try another search term.
          </p>
        )}
    </div>
  );
}
