import { LibraryBig, Search, User, SearchIcon, XIcon } from "lucide-react";
import {
  MetaFunction,
  useLoaderData,
  Form,
  useSearchParams,
} from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useState } from "react";
import { SignedOut, SignInButton, SignedIn } from "@clerk/remix";

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
import { BOOK_PARAM, QUERY_PARAM } from "~/constants";
import { useSelectedSearchedBook } from "~/hooks/useSelectedSearchedBook";
import { StickyHeader } from "~/components/sticky-header";
import { MenuBar } from "~/components/ui/bottom-menu";
import BookResultCard from "~/components/book-result-card";
import CreateListButton from "~/components/CreateListButton";

export const meta: MetaFunction = () => {
  return [{ title: "ShareReads | Search" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  return { userId };
};

function SearchPageBottomNav() {
  return (
    <div className="flex items-center justify-center fixed bottom-0 left-0 right-0 p-6">
      <MenuBar
        items={[
          {
            icon: () => <Search />,
            label: "Search",
            href: "/search",
          },
          {
            icon: () => <LibraryBig />,
            label: "Your lists",
            href: "/lists",
          },
          {
            icon: () => <User />,
            label: "Profile",
            href: "/profile",
          },
        ]}
      />
    </div>
  );
}

export default function SearchPage() {
  const { userId } = useLoaderData<typeof loader>();
  console.log("🚀 ~ SearchPage ~ userId:", userId);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get(QUERY_PARAM) || "";

  const [searchValue, setSearchValue] = useState(query);
  const [inputValue, setInputValue] = useState(query);
  const [emptyUrl, setEmptyUrl] = useState("/travolta.gif");

  const { data: searchResults, isLoading } = useGoogleBooks({
    query: searchValue,
  });

  // need to maintain selected book state for sign-in redirect_url during add-to-list user flow
  const { selectedBook, setSelectedBook, clearSelectedBook } =
    useSelectedSearchedBook({
      searchResults,
    });

  return (
    <div className="container px-3 mx-auto flex h-screen justify-center">
      <div className="flex flex-col items-center gap-16 w-full h-full max-w-3xl">
        <StickyHeader />
        <main className="max-w-3xl">
          <h1 className="text-3xl font-bold text-center ">
            Quickly create shareable book lists
          </h1>
          <>
            <div className="h-full mt-4">
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchValue(inputValue);

                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set(QUERY_PARAM, inputValue);
                    return newParams;
                  });
                }}
                className="mb-6 max-w-lg mx-auto"
                id="book-search-form"
              >
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <SearchField>
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
                          style={{
                            visibility:
                              inputValue.length > 0 ? "visible" : "hidden",
                          }}
                          onPress={() => {
                            setSearchValue("");
                            setInputValue("");
                            setSearchParams((prev) => {
                              const newParams = new URLSearchParams(prev);
                              newParams.delete(BOOK_PARAM);
                              newParams.delete(QUERY_PARAM);
                              return newParams;
                            });
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
                      Tip: Try searching for your favorite author or book title
                      to get started
                    </p>
                  </div>
                </div>
              )}

              {searchResults?.items && searchResults?.items?.length > 0 && (
                <>
                  <h2 className="font-semibold mb-2 text-sm">
                    Add these to a list
                  </h2>
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
                  clearSelectedBook();
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
                        <CreateListButton />
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
        </main>
      </div>
      <SearchPageBottomNav />
    </div>
  );
}
