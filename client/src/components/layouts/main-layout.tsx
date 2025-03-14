import { useState } from "react";
import Sidebar from "@/components/layouts/sidebar";
import MobileNavbar from "@/components/layouts/mobile-navbar";
import MobileHeader from "./mobile-navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={toggleSidebar} />
      
      {/* Sidebar */}
      <Sidebar 
        isMobile={!sidebarOpen} 
        className={sidebarOpen ? "translate-x-0" : ""} 
        onClose={closeSidebar}
      />
      
      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileNavbar />
    </div>
  );
}
