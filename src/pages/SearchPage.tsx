
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { BookList } from "@/components/BookList";
import { searchBooks, BookVolume } from "@/services/BookAPI";
import { AddToListDialog } from "@/components/AddToListDialog";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookVolume | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["books", searchTerm],
    queryFn: () => searchBooks(searchTerm),
    enabled: !!searchTerm,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  const handleAddToList = (book: BookVolume) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Find Books to Share</h1>
      
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-6 md:mb-8">
        <Input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="text-destructive p-4 bg-destructive/10 rounded-md mb-6">
          An error occurred while searching for books. Please try again.
        </div>
      )}

      {data?.items && data.items.length > 0 ? (
        <BookList 
          books={data.items} 
          onAddToList={handleAddToList} 
        />
      ) : searchTerm && !isLoading ? (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground">
            No books found for "{searchTerm}". Try another search term.
          </p>
        </div>
      ) : !searchTerm ? (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground">
            Enter a search term to find books.
          </p>
        </div>
      ) : null}

      {selectedBook && (
        <AddToListDialog
          book={selectedBook}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default SearchPage;
