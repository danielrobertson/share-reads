import { BookResult } from "~/types";

type Props = {
  book: BookResult;
};

export default function BookResultCard({ book }: Props) {
  return (
    <div
      key={book.id}
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-full"
    >
      <div className="flex lg:flex-row gap-4">
        {/* Modified mobile layout structure */}
        <div className="flex sm:flex-row gap-4 w-full">
          <div className="flex sm:flex-row gap-4">
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                className="w-24 h-32 object-cover rounded flex-shrink-0 mx-auto sm:mx-0"
              />
            )}

            <div className="min-w-0 flex-grow">
              <h2 className="">{book.volumeInfo.title}</h2>
              {book.volumeInfo.authors && (
                <p className="text-muted-foreground text-xs">
                  {book.volumeInfo.authors.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
