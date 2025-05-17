
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BookList, getList, copyShareableUrl } from "@/services/ListService";
import { BookList as BookListComponent } from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { Edit, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ListViewPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const [list, setList] = useState<BookList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (listId) {
      try {
        const foundList = getList(listId);
        setList(foundList);
        if (!foundList) {
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

  const handleCopyLink = async () => {
    if (!listId) return;
    
    const success = await copyShareableUrl(listId);
    if (success) {
      toast({
        title: "Link copied",
        description: "The shareable link has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
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
        <Button asChild>
          <Link to="/my-lists">Go to My Lists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{list.name}</h1>
          {list.description && (
            <p className="text-muted-foreground mt-2">{list.description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-1" 
            onClick={handleCopyLink}
          >
            <LinkIcon size={16} />
            Share
          </Button>
          <Button 
            variant="outline" 
            className="gap-1" 
            asChild
          >
            <Link to={`/list/${list.id}/edit`}>
              <Edit size={16} />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 py-2 px-3 bg-accent/50 text-accent-foreground rounded-md text-sm">
        {list.books.length} {list.books.length === 1 ? "book" : "books"} 
        &bull; Last updated {new Date(list.updatedAt).toLocaleDateString()}
      </div>

      <BookListComponent 
        books={list.books} 
        showAddButton={false} 
      />
    </div>
  );
};

export default ListViewPage;
