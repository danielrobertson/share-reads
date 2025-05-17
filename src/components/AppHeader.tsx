
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  toggleSidebar?: () => void;
};

export const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4">
      <div className="flex-1 flex items-center gap-2">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu size={20} />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
        <img 
          src="/logo.png" 
          alt="ShareReads Logo" 
          className="h-8 w-8"
        />
        <span className="text-xl font-semibold text-white">ShareReads</span>
      </div>
    </header>
  );
};
