import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t py-4 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Faving. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;