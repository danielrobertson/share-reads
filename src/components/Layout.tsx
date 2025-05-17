
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

const Layout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Auto-collapse sidebar on mobile when component mounts or window resizes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 relative">
        <AppSidebar isOpen={isSidebarOpen} />
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
