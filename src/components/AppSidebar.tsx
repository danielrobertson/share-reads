
import { NavLink } from "react-router-dom";
import { Search, List, LogIn, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

type AppSidebarProps = {
  isOpen: boolean;
};

export const AppSidebar = ({ isOpen }: AppSidebarProps) => {
  const { user } = useAuth();
  
  const renderUserSection = () => {
    if (!isOpen) {
      return (
        <div className="flex justify-center">
          {user ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || "User"} />
              <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <NavLink to="/auth">
                <LogIn size={20} />
              </NavLink>
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="p-4">
        {user ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.name || "User"} />
              <AvatarFallback>{user.email?.[0].toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.user_metadata?.name || user.email}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
            </div>
          </div>
        ) : (
          <Button variant="outline" asChild className="w-full">
            <NavLink to="/auth" className="flex items-center justify-center gap-2">
              <LogIn size={16} />
              <span>Sign In</span>
            </NavLink>
          </Button>
        )}
      </div>
    );
  };
  
  if (!isOpen) {
    return (
      <div className="w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 border-r border-gray-800 transition-all duration-300">
        <div className="flex flex-col items-center gap-6 mt-6 flex-1">
          <NavLink to="/" className={({ isActive }) => 
            `p-3 rounded-md ${isActive ? 'bg-accent text-white' : 'text-gray-400 hover:bg-accent/50 hover:text-white'} transition-colors`
          }>
            <Search size={20} />
          </NavLink>
          
          <NavLink to="/my-lists" className={({ isActive }) => 
            `p-3 rounded-md ${isActive ? 'bg-accent text-white' : 'text-gray-400 hover:bg-accent/50 hover:text-white'} transition-colors`
          }>
            <List size={20} />
          </NavLink>
        </div>
        
        <div className="mt-auto mb-4">
          {renderUserSection()}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800 transition-all duration-300">
      <div className="flex flex-col py-4 flex-1">        
        <div className="space-y-1 px-3">
          <NavLink to="/" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-accent text-white' : 'text-gray-400 hover:bg-accent/50 hover:text-white'} transition-colors`
          }>
            <Search size={18} />
            <span>Search Books</span>
          </NavLink>
          
          <NavLink to="/my-lists" className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md ${isActive ? 'bg-accent text-white' : 'text-gray-400 hover:bg-accent/50 hover:text-white'} transition-colors`
          }>
            <List size={18} />
            <span>My Lists</span>
          </NavLink>
        </div>
      </div>
      
      <div className="mt-auto">
        <Separator className="mb-2" />
        {renderUserSection()}
      </div>
    </div>
  );
};
