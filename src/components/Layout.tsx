
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
        
        <div className="flex-1 flex flex-col">
          {/* Sidebar toggle area without breadcrumb and border */}
          <div className="h-12 flex items-center px-4">
            <button 
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
            >
              <PanelLeft size={18} className={`transform transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
            </button>
          </div>
          
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
