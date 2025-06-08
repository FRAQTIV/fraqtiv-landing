import React from 'react';

const About: React.FC = () => {

  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-br from-slate-800 via-slate-900 to-dark-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-light-text mb-6">
            Meet the <span className="text-brand-primary">Architect</span>
          </h2>
          <p className="text-xl text-medium-text max-w-3xl mx-auto">
            When your business is ready for transformation, experience matters. Meet the operator who's been there, done that—and delivered results.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Photo with enhanced styling */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
                      <div className="relative group">
              {/* Main photo container */}
              <div className="relative w-80 h-96 md:w-96 md:h-[28rem]">
                <img
                  src="/images/josh-way-photo.jpeg"
                  alt="Josh Way - Founder & Principal Advisor"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{
                    filter: 'contrast(1.1) brightness(1.05) saturate(1.1) blur(0px) drop-shadow(0 0 8px rgba(0,0,0,0.3))',
                    backdropFilter: 'blur(2px)'
                  }}
                />
                
                {/* Professional studio backdrop overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-700/20 via-slate-800/30 to-slate-900/40"></div>
                
                {/* Studio lighting effect */}
                <div 
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15, 23, 42, 0.2) 70%)'
                  }}
                ></div>
                
                {/* Professional vignette */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-dark-bg/30 via-transparent to-transparent"></div>
                
                {/* Stats overlay card */}
                <div className="absolute -bottom-6 -right-6 bg-dark-card/95 backdrop-blur-lg p-6 rounded-2xl border border-brand-primary/20 shadow-2xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-primary mb-1">$50M+</div>
                    <div className="text-sm text-medium-text font-medium">Value Unlocked</div>
                  </div>
                </div>
                
                {/* Floating credential badge */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-brand-primary to-brand-secondary p-4 rounded-2xl shadow-xl">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">Operator First</div>
                  </div>
                </div>
              </div>
              
              {/* Background accent elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-brand-secondary/10 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Name and title */}
              <div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-light-text mb-2">
                  Josh Way
                </h3>
                <p className="text-2xl text-brand-secondary font-semibold mb-6">
                  Founder & Principal Advisor
                </p>
                <p className="text-lg text-medium-text leading-relaxed">
                  20+ years steering high‑growth companies as CIO, COO, and CEO—delivering hands‑on transformation, not slide decks. Built and exited multiple IT‑centric businesses; created audit‑ready $3M to $10M P&Ls and systematized operations inside 12 months.
                </p>
              </div>

              {/* Key differentiators in a more visual layout */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <div className="bg-gradient-to-br from-dark-card to-slate-800/50 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 group-hover:border-brand-primary/40 group-hover:shadow-lg group-hover:shadow-brand-primary/10">
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-brand-secondary mb-3">S3 Framework</h4>
                    <p className="text-medium-text text-sm">
                      Architect of FRAQTIV's signature methodology: cloud modernization and business‑model validation.
                    </p>
                  </div>
                </div>

                <div className="group">
                  <div className="bg-gradient-to-br from-dark-card to-slate-800/50 p-6 rounded-2xl border border-slate-700/50 transition-all duration-300 group-hover:border-brand-primary/40 group-hover:shadow-lg group-hover:shadow-brand-primary/10">
                    <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-brand-secondary mb-3">Personal Accountability</h4>
                    <p className="text-medium-text text-sm">
                      Personally leads every engagement—your single point of accountability from discovery through buyer Q&A.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cross-sector experience as a highlight banner */}
              <div className="bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-primary/10 p-6 rounded-2xl border border-brand-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-brand-secondary mb-2">Cross‑Sector Expertise</h4>
                    <p className="text-medium-text">
                      Proven wins across IT services, SaaS, healthcare, fintech, and manufacturing. His team can assist with compliance and buy‑side diligence expectations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 