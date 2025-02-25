import { useState } from "react";
import { Plus, SearchIcon, XIcon } from "lucide-react";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";

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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { useGoogleBooks } from "~/hooks/useGoogleBooks";
import BookResultCard from "./book-result-card";

export function BookSearch() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");

  const { data: searchResults, isLoading } = useGoogleBooks({ query });

  const [emptyUrl, setEmptyUrl] = useState("/travolta.gif");

  return (
    <>
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
            <h2 className="font-semibold mb-2 text-sm">Add these to a list</h2>
            <ul className="space-y-4">
              {searchResults.items.map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center"
                  id="book-search-result"
                >
                  <Drawer>
                    <DrawerTrigger className="w-full text-left">
                      <BookResultCard book={book} />
                    </DrawerTrigger>

                    <DrawerContent>
                      <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                          <DrawerTitle>Add to list</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 pb-0">
                          <div className="flex flex-col  space-x-2">
                            <Button variant="secondary" size="default">
                              <Plus />
                              Create list
                            </Button>
                          </div>
                          <div className="mt-3 h-[120px]">
                            <p className="text-xs text-muted-foreground mt-5">
                              No lists found
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
    </>
  );
}
