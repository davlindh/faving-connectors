import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Faving</Link>
        <div className="space-x-4">
          <Link to="/projects">Projects</Link>
          <Link to="/knowledge-base">Knowledge Base</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/messages">Messages</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;