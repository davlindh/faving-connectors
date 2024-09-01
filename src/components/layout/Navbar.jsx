import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Faving</Link>
        <div className="hidden md:flex space-x-4">
          <Link to="/projects">Projects</Link>
          <Link to="/knowledge-base">Knowledge Base</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/messages">Messages</Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link to="/projects" className="block py-2">Projects</Link>
          <Link to="/knowledge-base" className="block py-2">Knowledge Base</Link>
          <Link to="/profile" className="block py-2">Profile</Link>
          <Link to="/messages" className="block py-2">Messages</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
