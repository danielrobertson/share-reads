
import { BookVolume } from "@/services/BookAPI";
import { BookCard } from "./BookCard";

type BookListProps = {
  books: BookVolume[];
  onAddToList?: (book: BookVolume) => void;
  showAddButton?: boolean;
};

export const BookList = ({ books, onAddToList, showAddButton = true }: BookListProps) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-8 md:py-10">
        <p className="text-muted-foreground">No books found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {books.map((book) => (
        <BookCard 
          key={book.id} 
          book={book} 
          showAddButton={showAddButton}
          onAddToList={onAddToList ? () => onAddToList(book) : undefined} 
        />
      ))}
    </div>
  );
};
