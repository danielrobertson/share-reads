
import { PanelLeft } from "lucide-react";

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
        <PanelLeft size={20} />
      </button>
      <div className="ml-4 flex items-center gap-2">
        <img 
          src="/lovable-uploads/f5dbc430-959c-465a-b58e-f040f8a1a881.png" 
          alt="ShareReads Logo" 
          className="h-8 w-8"
        />
        <span className="text-xl font-semibold text-white">ShareReads</span>
      </div>
    </header>
  );
};
