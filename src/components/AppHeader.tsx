
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

type AppHeaderProps = {
  toggleSidebar?: () => void;
};

export const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4">
      <div className="flex-1 flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="ShareReads Logo" 
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-white">ShareReads</span>
        </Link>
      </div>
      
      <div>
        {!user && (
          <Button variant="outline" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
