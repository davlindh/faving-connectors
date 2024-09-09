import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-grow">
        <header className="bg-white/80 backdrop-blur-md shadow-sm lg:hidden sticky top-0 z-10">
          <div className="px-4 py-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            <div className="mt-4">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;