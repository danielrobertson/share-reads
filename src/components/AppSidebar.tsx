
import { NavLink } from "react-router-dom";
import { Search, List, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type AppSidebarProps = {
  isOpen: boolean;
};

export const AppSidebar = ({ isOpen }: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  
  // Helper to get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  if (!isOpen) {
    return (
      <div className="w-16 bg-sidebar min-h-screen flex flex-col items-center py-4 border-r border-gray-800 transition-all duration-300">
        <div className="flex flex-col items-center gap-6 mt-6">
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
        
        {/* User profile section (collapsed) */}
        <div className="mt-auto mb-4">
          {user ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          ) : (
            <NavLink to="/auth" className="text-gray-400 hover:bg-accent/50 hover:text-white p-3 rounded-md transition-colors">
              <LogIn size={20} />
            </NavLink>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-[232px] bg-sidebar min-h-screen flex flex-col border-r border-gray-800 transition-all duration-300">
      <div className="flex flex-col py-4">        
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
      
      {/* User profile section */}
      <div className="mt-auto p-4 border-t border-gray-800">
        {user ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <NavLink to="/auth">
            <Button variant="outline" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};
