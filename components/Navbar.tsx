import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#about', label: 'About' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg fixed w-full z-50 top-0">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#hero" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/images/fraqtiv-logo.png" 
              alt="FRAQTIV" 
              className="h-12 w-auto"
            />
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-700 hover:text-brand-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                {link.label}
              </a>
            ))}
            <Link
              to="/get-started"
              className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-700 hover:text-brand-primary focus:outline-none focus:text-brand-primary"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" clipRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-300">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-slate-700 hover:text-brand-primary transition-colors block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-100" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <Link
                to="/get-started"
                className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-4 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105 text-center mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
