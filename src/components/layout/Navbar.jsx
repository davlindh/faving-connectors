import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { navItems } from '@/nav-items';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    if (auth && auth.signOut) {
      await auth.signOut();
      navigate('/');
    }
  };

  const renderNavLink = (item) => {
    if ((item.title === 'Login' || item.title === 'Register') && auth?.session) {
      return null;
    }
    if ((item.title === 'Profile' || item.title === 'Messages') && !auth?.session) {
      return null;
    }
    return (
      <Link
        key={item.to}
        to={item.to}
        className={`block py-2 ${location.pathname === item.to ? 'text-primary' : ''}`}
      >
        {item.title}
      </Link>
    );
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Faving</Link>
        <div className="hidden md:flex space-x-4">
          {navItems.map(renderNavLink)}
          {auth?.session && (
            <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
          )}
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
          {navItems.map(renderNavLink)}
          {auth?.session && (
            <Button variant="ghost" onClick={handleSignOut} className="block py-2 w-full text-left">Sign Out</Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;