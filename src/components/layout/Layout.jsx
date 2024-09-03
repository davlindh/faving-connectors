import React from 'react';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 overflow-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;