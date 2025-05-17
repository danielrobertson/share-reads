
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ListCard } from "@/components/ListCard";
import { getLists, BookList, createList } from "@/services/ListService";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const MyListsPage = () => {
  const { toast } = useToast();
  const [lists, setLists] = useState<BookList[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    // Load lists from storage
    setLists(getLists());
  }, []);

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    
    try {
      const newList = createList(newListName.trim());
      setLists([...lists, newList]);
      setNewListName("");
      setIsCreating(false);
      toast({
        title: "List created",
        description: `"${newListName.trim()}" has been created`,
      });
    } catch (e) {
      console.error("Error creating list:", e);
      toast({
        title: "Error",
        description: "Failed to create list",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Lists</h1>
        
        {!isCreating && (
          <Button 
            onClick={() => setIsCreating(true)} 
            className="gap-1"
          >
            <Plus size={16} />
            New List
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="mb-6 p-4 border border-border rounded-md bg-card">
          <h3 className="text-lg font-medium mb-3">Create New List</h3>
          <div className="flex gap-2">
            <Input
              placeholder="List name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleCreateList} disabled={!newListName.trim()}>
              Create
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreating(false);
                setNewListName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {lists.length > 0 ? (
        <div className="space-y-4">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card/50 rounded-lg border border-border">
          <h3 className="text-xl font-medium mb-2">No lists yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first book list
          </p>
          
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)} 
              className="gap-1"
            >
              <Plus size={16} />
              Create List
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyListsPage;
