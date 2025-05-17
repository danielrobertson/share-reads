
import { BookVolume } from "@/services/BookAPI";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type BookCardProps = {
  book: BookVolume;
  onAddToList?: () => void;
  showAddButton?: boolean;
};

export const BookCard = ({ book, onAddToList, showAddButton = true }: BookCardProps) => {
  const { volumeInfo } = book;
  
  const thumbnail = volumeInfo.imageLinks?.thumbnail || "/placeholder.svg";
  const title = volumeInfo.title || "Unknown Title";
  const authors = volumeInfo.authors?.join(", ") || "Unknown Author";
  
  return (
    <Card className="overflow-hidden hover:bg-card/80 transition-colors feature-card">
      <CardContent className="p-4 flex gap-4">
        <div className="flex-shrink-0">
          <img 
            src={thumbnail} 
            alt={`Cover of ${title}`} 
            className="w-24 h-36 object-cover rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{authors}</p>
          
          {volumeInfo.publishedDate && (
            <p className="text-sm text-muted-foreground mt-1">
              {volumeInfo.publishedDate.substring(0, 4)}
            </p>
          )}
          
          {volumeInfo.description && (
            <p className="text-sm mt-2 line-clamp-2">
              {volumeInfo.description}
            </p>
          )}
          
          <div className="mt-auto pt-2">
            {showAddButton && onAddToList && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onAddToList} 
                className="text-xs gap-1"
              >
                <Plus size={14} />
                Add to List
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
