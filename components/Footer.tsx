import React from 'react';
import { Link } from 'react-router-dom';


const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-slate-700/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          <div className="md:col-span-1">
            <a href="#hero" className="text-xl font-bold text-brand-primary hover:text-brand-secondary transition-colors inline-block">
              FRAQTIV
            </a>
            <p className="mt-2 text-sm text-subtle-text">
              Operator-led advisory removing deal‑killing red flags.
            </p>
          </div>
          
          <div className="md:col-span-1 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <a href="#services" className="text-medium-text hover:text-light-text transition-colors duration-200 hover:underline">Services</a>
                            <Link to="/get-started" className="text-medium-text hover:text-light-text transition-colors duration-200 hover:underline">Get Started</Link>
            <a href="mailto:josh@fraqtiv.com" className="text-medium-text hover:text-light-text transition-colors duration-200 hover:underline">Contact</a>
          </div>

          <div className="md:col-span-1 flex justify-center md:justify-end space-x-5">
            <a href="https://www.linkedin.com/company/fraqtiv-inc" target="_blank" rel="noopener noreferrer" className="text-subtle-text hover:text-brand-primary transition-colors duration-200 transform hover:scale-110" title="LinkedIn">
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a href="mailto:josh@fraqtiv.com" className="text-subtle-text hover:text-brand-primary transition-colors duration-200 transform hover:scale-110" title="Email">
              <EmailIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-700/50 text-center text-subtle-text text-sm">
          &copy; {currentYear} FRAQTIV Advisory. All rights reserved. Turning legacy operations into buyer-ready growth engines.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
