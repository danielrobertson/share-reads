
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <AppSidebar isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto p-6 md:p-8 bg-background">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
