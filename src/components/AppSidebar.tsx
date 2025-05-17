
import { NavLink } from "react-router-dom";
import { Search, List, BookOpen } from "lucide-react";

type AppSidebarProps = {
  isOpen: boolean;
};

export const AppSidebar = ({ isOpen }: AppSidebarProps) => {
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
    </div>
  );
};
