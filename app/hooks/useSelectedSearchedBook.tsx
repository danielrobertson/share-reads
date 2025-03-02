import { useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { BOOK_PARAM } from "~/constants";
import { BookResult, GoogleBooksSearchResponse } from "~/types";

export function useSelectedSearchedBook({
  searchResults,
}: {
  searchResults?: GoogleBooksSearchResponse;
}) {
  const [selectedBook, setSelectedBook] = useState<BookResult | null>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const bookId = searchParams.get(BOOK_PARAM);
    if (bookId) {
      const book = searchResults?.items?.find((item) => item.id === bookId);
      setSelectedBook(book || null);
    }
  }, [searchParams, searchResults]);

  useEffect(() => {
    if (selectedBook) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(BOOK_PARAM, selectedBook.id);
        return newParams;
      });
    }
  }, [selectedBook, searchParams, setSearchParams]);

  const clearSelectedBook = () => {
    setSelectedBook(null);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(BOOK_PARAM);
      return newParams;
    });
  };

  return { selectedBook, setSelectedBook, clearSelectedBook };
}
