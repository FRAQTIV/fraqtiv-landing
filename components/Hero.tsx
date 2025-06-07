import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-dark-bg via-slate-800 to-sky-900 pt-36 pb-24 md:pt-48 md:pb-36 flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(200,220,255,0.5)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>
      <div className="container mx-auto px-6 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-light-text mb-6 leading-tight">
          <span className="text-brand-primary">Unlock Hidden Value</span> Before You Sell Your Business
        </h1>
        <p className="text-lg md:text-xl text-medium-text max-w-3xl mx-auto mb-4">
          <span className="text-brand-secondary font-semibold">IT • Operations • Business‑Model Innovation</span>
        </p>
        <p className="text-base md:text-lg text-medium-text max-w-4xl mx-auto mb-10 leading-relaxed">
          Buyers don't just buy balance sheets—they buy systems that scale. The big diligence deal‑killers are legacy tech, brittle processes, and fuzzy revenue logic. FRAQTIV plugs in operator‑grade leadership to modernize your IT architecture, streamline operations, and sharpen your business model—sculpt a company that commands a premium.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link
            to="/get-started"
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-8 py-4 rounded-lg shadow-xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-dark-bg hover:shadow-2xl"
          >
            Contact Us
          </Link>
          <a
            href="#services"
            className="w-full sm:w-auto bg-dark-card hover:bg-slate-700 text-medium-text font-semibold px-8 py-4 rounded-lg shadow-xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105 border border-slate-600 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-dark-bg hover:shadow-2xl"
          >
            Our Services
          </a>
        </div>
      </div>
      <div className="absolute -bottom-1/3 -left-1/4 w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-sky-700/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute -top-1/4 -right-1/4 w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-indigo-600/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-bg to-transparent z-0"></div>
    </section>
  );
};

export default Hero;
