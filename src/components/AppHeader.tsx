
import { LogIn, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type AppHeaderProps = {
  toggleSidebar?: () => void;
};

export const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center gap-2">
        {isMobile && toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        
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
