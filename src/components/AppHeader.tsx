
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

type AppHeaderProps = {
  toggleSidebar?: () => void;
};

export const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <img 
          src="/logo.png" 
          alt="ShareReads Logo" 
          className="h-8 w-8"
        />
        <span className="text-xl font-semibold text-white">ShareReads</span>
      </div>
      
      {!user && (
        <Link to="/auth">
          <Button variant="outline" size="sm" className="ml-auto md:hidden">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
      )}
    </header>
  );
};
