import React from "react";
import { BookResult } from "~/types";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";

type Props = {
  book: BookResult;
  addToList?: (book: BookResult) => void;
  isAdded?: boolean;
};

export default function BookResultCard({ book, addToList, isAdded }: Props) {
  return (
    <div
      key={book.id}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-full"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Modified mobile layout structure */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4">
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="w-24 h-32 object-cover rounded flex-shrink-0 mx-auto sm:mx-0"
              />
            )}

            <div className="min-w-0 flex-grow">
              <h2 className="text-xl font-semibold text-center sm:text-left">
                {book.volumeInfo.title}
              </h2>
              {book.volumeInfo.authors && (
                <p className="text-gray-600 text-center sm:text-left">
                  {book.volumeInfo.authors.join(", ")}
                </p>
              )}
              {book.volumeInfo.publishedDate && (
                <p className="text-gray-500 text-xs text-center sm:text-left">
                  Published: {book.volumeInfo.publishedDate}
                </p>
              )}
              {book.volumeInfo.description && addToList && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-3 sm:line-clamp-2">
                  {book.volumeInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>
        {addToList && (
          <div className="relative w-full lg:w-auto lg:flex-shrink-0">
            <Button
              variant={"outline"}
              className="w-full lg:w-auto"
              onClick={() => addToList(book)}
              id="book-search-result-add-button"
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to List
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
