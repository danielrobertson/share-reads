
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookVolume } from "@/services/BookAPI";
import { 
  fetchLists, 
  createList, 
  addBookToList, 
  BookList 
} from "@/services/SupabaseListService";

type AddToListDialogProps = {
  book: BookVolume;
  isOpen: boolean;
  onClose: () => void;
};

export const AddToListDialog = ({ book, isOpen, onClose }: AddToListDialogProps) => {
  const { toast } = useToast();
  const [lists, setLists] = useState<BookList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    if (isOpen) {
      const loadLists = async () => {
        setIsLoading(true);
        const fetchedLists = await fetchLists();
        setLists(fetchedLists);
        setIsLoading(false);
      };
      
      loadLists();
    }
  }, [isOpen]);

  const handleAddToList = async (listId: string) => {
    try {
      const updated = await addBookToList(listId, book);
      if (updated) {
        toast({
          title: "Book added",
          description: `Added "${book.volumeInfo.title}" to your list`,
        });
        onClose();
      }
    } catch (e) {
      console.error("Error adding book to list:", e);
      toast({
        title: "Error",
        description: "Failed to add book to list",
        variant: "destructive",
      });
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newListName.trim()) return;
    
    try {
      const newList = await createList(newListName.trim());
      if (newList) {
        const updated = await addBookToList(newList.id, book);
        if (updated) {
          toast({
            title: "List created",
            description: `Added "${book.volumeInfo.title}" to "${newListName.trim()}"`,
          });
          onClose();
        }
      }
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to List</DialogTitle>
        </DialogHeader>

        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-4">
              Loading your lists...
            </div>
          ) : isCreatingNew ? (
            <div className="space-y-4">
              <Input
                placeholder="List name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingNew(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAndAdd}
                  disabled={!newListName.trim()}
                >
                  Create & Add
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {lists.length > 0 ? (
                  lists.map((list) => (
                    <div 
                      key={list.id}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleAddToList(list.id)}
                    >
                      <div>
                        <p className="font-medium">{list.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {list.books.length} {list.books.length === 1 ? "book" : "books"}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost">Add</Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    You don't have any lists yet
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setIsCreatingNew(true)}
                >
                  <Plus size={16} />
                  Create New List
                </Button>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
