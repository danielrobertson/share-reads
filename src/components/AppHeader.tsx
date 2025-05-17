
import { Menu } from "lucide-react";

type AppHeaderProps = {
  toggleSidebar: () => void;
};

export const AppHeader = ({ toggleSidebar }: AppHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4">
      <button 
        onClick={toggleSidebar} 
        className="p-2 rounded-md hover:bg-muted transition-colors"
      >
        <Menu size={20} />
      </button>
      <div className="ml-4 flex items-center gap-2">
        <span className="text-xl font-semibold text-white">ShareReads</span>
      </div>
    </header>
  );
};
