import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  if (user && isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F5E6D3]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-sm font-serif">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-[#8B4513] tracking-wider flex items-center gap-3 group">
          <img 
            src="https://horizons-cdn.hostinger.com/037bde25-b36f-425a-8f08-2d594dea4bfb/672903cb83c6bc20266416e73729efb7.png"
            alt="Relicsphere Logo"
            className="h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-110 group-hover:opacity-90"
          />
          <span className="text-[#8B4513] embassy-font">Relicsphere</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg font-medium transition-colors hover:text-[#D4AF37] ${
                location.pathname === link.path ? 'text-[#8B4513] font-bold underline decoration-[#D4AF37] decoration-2 underline-offset-4' : 'text-[#5C4033]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
           <Link to="/cart" className="relative p-2 text-[#5C4033] hover:text-[#8B4513] transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-[#5C4033] hover:text-[#8B4513] hover:bg-[#D4AF37]/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-[#8B4513] hover:bg-[#5C4033] text-white">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#8B4513]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#F5E6D3] border-t border-[#D4AF37]/30"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-lg font-medium text-[#5C4033] hover:text-[#8B4513]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-[#D4AF37]/30 my-2"></div>
              <Link
                to="/cart"
                className="flex items-center justify-between text-[#5C4033]"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Cart</span>
                <span className="bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">{getCartCount()}</span>
              </Link>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="justify-start px-0 text-[#5C4033] hover:text-[#8B4513]"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#8B4513] hover:bg-[#5C4033] text-white">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;