
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookList } from "@/services/ListService";
import { Button } from "@/components/ui/button";
import { Edit, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { copyShareableUrl } from "@/services/ListService";

type ListCardProps = {
  list: BookList;
};

export const ListCard = ({ list }: ListCardProps) => {
  const { toast } = useToast();
  
  const handleCopyLink = async () => {
    const success = await copyShareableUrl(list.id);
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

  const formattedDate = new Date(list.updatedAt).toLocaleDateString();
  const bookCount = list.books.length;
  
  return (
    <Card className="overflow-hidden hover:bg-card/80 transition-colors">
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{list.name}</h3>
        
        {list.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {list.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">
            {bookCount} {bookCount === 1 ? "book" : "books"}
          </span>
          <span className="text-xs text-muted-foreground mx-1">•</span>
          <span className="text-xs text-muted-foreground">
            Updated {formattedDate}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-card border-t border-border flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="text-xs"
        >
          <Link to={`/list/${list.id}`}>
            View List
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyLink}
            title="Copy shareable link"
          >
            <LinkIcon size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            asChild
            title="Edit list"
          >
            <Link to={`/list/${list.id}/edit`}>
              <Edit size={16} />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
