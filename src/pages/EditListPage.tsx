
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  BookList, 
  getList, 
  updateList, 
  removeBookFromList, 
  deleteList 
} from "@/services/ListService";
import { BookVolume } from "@/services/BookAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Save, ArrowLeft, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditListPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [list, setList] = useState<BookList | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (listId) {
      try {
        const foundList = getList(listId);
        setList(foundList);
        
        if (foundList) {
          setName(foundList.name);
          setDescription(foundList.description);
        } else {
          setError("List not found");
        }
      } catch (e) {
        console.error("Error loading list:", e);
        setError("An error occurred while loading this list");
      } finally {
        setLoading(false);
      }
    }
  }, [listId]);

  const handleSave = () => {
    if (!list || !name.trim()) return;
    
    setSaving(true);
    try {
      const updated = updateList({
        ...list,
        name: name.trim(),
        description: description.trim()
      });
      
      setList(updated);
      toast({
        title: "List updated",
        description: "Your changes have been saved",
      });
      navigate(`/list/${list.id}`);
    } catch (e) {
      console.error("Error updating list:", e);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBook = (bookId: string) => {
    if (!list || !listId) return;
    
    try {
      const updated = removeBookFromList(listId, bookId);
      setList(updated);
      toast({
        title: "Book removed",
        description: "Book was removed from the list",
      });
    } catch (e) {
      console.error("Error removing book:", e);
      toast({
        title: "Error",
        description: "Failed to remove book",
        variant: "destructive",
      });
    }
  };

  const handleDeleteList = () => {
    if (!list || !listId) return;
    
    if (window.confirm("Are you sure you want to delete this list? This action cannot be undone.")) {
      try {
        deleteList(listId);
        toast({
          title: "List deleted",
          description: "The list has been permanently deleted",
        });
        navigate("/my-lists");
      } catch (e) {
        console.error("Error deleting list:", e);
        toast({
          title: "Error",
          description: "Failed to delete list",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p>Loading list...</p>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p className="mb-6">{error || "List not found"}</p>
        <Button 
          onClick={() => navigate("/my-lists")}
        >
          Go to My Lists
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/list/${list.id}`)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">Edit List</h1>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            List Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for your list"
            className="max-w-md"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description for your list"
            className="max-w-md"
            rows={3}
          />
        </div>

        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-4">Books ({list.books.length})</h2>
          
          {list.books.length > 0 ? (
            <div className="space-y-3">
              {list.books.map((book) => (
                <BookItem 
                  key={book.id}
                  book={book}
                  onRemove={() => handleRemoveBook(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-card/50 rounded-lg border border-border">
              <p className="text-muted-foreground">
                This list doesn't have any books yet.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button 
            variant="destructive" 
            onClick={handleDeleteList}
            className="gap-1"
          >
            <Trash size={16} />
            Delete List
          </Button>
          
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || saving}
            className="gap-1"
          >
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

interface BookItemProps {
  book: BookVolume;
  onRemove: () => void;
}

const BookItem = ({ book, onRemove }: BookItemProps) => {
  const { volumeInfo } = book;
  
  const thumbnail = volumeInfo.imageLinks?.thumbnail || "/placeholder.svg";
  const title = volumeInfo.title || "Unknown Title";
  const authors = volumeInfo.authors?.join(", ") || "Unknown Author";
  
  return (
    <Card>
      <CardContent className="p-3 flex items-center gap-3">
        <img 
          src={thumbnail} 
          alt={`Cover of ${title}`} 
          className="w-12 h-16 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{title}</p>
          <p className="text-sm text-muted-foreground truncate">{authors}</p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          title="Remove from list"
        >
          <X size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EditListPage;
