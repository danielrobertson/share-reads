
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { PanelLeft } from "lucide-react";

const Layout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  // Auto-collapse sidebar on mobile when component mounts or window resizes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex flex-1 relative">
        <AppSidebar isOpen={isSidebarOpen} />
        
        {/* Sidebar toggle positioned at edge of content area */}
        <button 
          onClick={toggleSidebar}
          className={`absolute z-10 top-6 ${isSidebarOpen ? 'left-[232px] md:left-[232px]' : 'left-16'} bg-background border border-border rounded-full p-1 -ml-3 hover:bg-muted transition-all shadow-md`}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} className={`transform transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
        </button>
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
