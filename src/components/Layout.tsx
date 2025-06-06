
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  
  // Auto-collapse sidebar on mobile when component mounts or window resizes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16 relative"> {/* Added pt-16 to account for fixed header height */}
        <div className="fixed top-16 bottom-0 left-0 z-10">
          <AppSidebar isOpen={isSidebarOpen} />
        </div>
        <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'md:ml-[232px]' : 'ml-16'}`}>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
