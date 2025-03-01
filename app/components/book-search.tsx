import { useEffect, useState } from "react";
import { Plus, SearchIcon, XIcon } from "lucide-react";
import { SignedOut, SignInButton, SignedIn } from "@clerk/remix";
import { Form, useSearchParams } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";
import {
  SearchField,
  SearchFieldClear,
  SearchFieldInput,
} from "~/components/ui/searchfield";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { useGoogleBooks } from "~/hooks/useGoogleBooks";
import BookResultCard from "./book-result-card";
import { BookResult } from "~/types";

const BOOK_PARAM = "book";
const QUERY_PARAM = "q";

export function BookSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get(QUERY_PARAM) || "";

  const [searchValue, setSearchValue] = useState(query);
  const [inputValue, setInputValue] = useState(query);
  const [emptyUrl, setEmptyUrl] = useState("/travolta.gif");
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);

  const { data: searchResults, isLoading } = useGoogleBooks({
    query: searchValue,
  });

  useEffect(() => {
    // maintain the selected book in the URL for sign-in redirect_url during add-to-list user flow
    if (selectedBook) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(BOOK_PARAM, selectedBook.id);
        return newParams;
      });
    }
  }, [selectedBook, searchParams, setSearchParams]);

  return (
    <>
      <div className="h-full mt-4">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchValue(inputValue);

            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.set("q", inputValue);
              return newParams;
            });
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
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full"
                    id="book-search-input"
                    aria-label="Search"
                    value={inputValue}
                  />
                  <SearchFieldClear
                    onPress={() => {
                      setSearchValue("");
                      setInputValue("");
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
        </Form>

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
            <h2 className="font-semibold mb-2 text-sm">Add these to a list</h2>
            <ul className="space-y-4">
              {searchResults.items.map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center"
                  id="book-search-result"
                >
                  <button
                    className="w-full text-left"
                    onClick={() => setSelectedBook(book)}
                  >
                    <BookResultCard book={book} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {searchValue &&
          searchResults &&
          searchResults?.totalItems === 0 &&
          !isLoading && (
            <p className="text-center text-xs text-muted-foreground">
              No books found. Try another search term.
            </p>
          )}

        <Drawer
          open={!!selectedBook}
          onClose={() => {
            setSelectedBook(null);
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev);
              newParams.delete(BOOK_PARAM);
              return newParams;
            });
          }}
        >
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Add to list</DrawerTitle>
                <DrawerDescription>
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={selectedBook?.volumeInfo.imageLinks?.thumbnail}
                      alt={selectedBook?.volumeInfo.title}
                      className="h-16 rounded-md"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {selectedBook?.volumeInfo.title}
                      </p>
                      <p className="text-left text-xs text-muted-foreground">
                        {selectedBook?.volumeInfo.authors?.join(", ")}
                      </p>
                    </div>
                  </div>
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex flex-col space-x-2">
                  <Button variant="secondary" size="default">
                    <Plus />
                    Create list
                  </Button>
                </div>
                <div className="mt-3 h-[120px]">
                  <p className="text-xs text-muted-foreground mt-5">
                    <SignedIn>No lists found</SignedIn>
                    <SignedOut>
                      <SignInButton
                        signUpForceRedirectUrl={`/search?${searchParams.toString()}`}
                      >
                        <button className="underline">Sign in</button>
                      </SignInButton>{" "}
                      to view your lists
                    </SignedOut>
                  </p>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
