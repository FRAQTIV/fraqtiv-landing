import React from 'react';

const CallToAction: React.FC = () => {
  return (
    <section id="cta" className="py-20 md:py-32 bg-gradient-to-br from-slate-800 via-sky-900 to-dark-bg text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-light-text mb-6">
          Ready to Remove Deal‑Killing Red Flags?
        </h2>
        <p className="text-lg md:text-xl text-medium-text max-w-3xl mx-auto mb-10">
          Clients typically see 1–2× multiple expansion driven by stronger tech posture, cleaner ops, and a crystal‑clear revenue story. If your IT, operations, or business model could raise red flags, let&apos;s neutralize them now.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-8">
          <a
            href="mailto:josh@fraqtiv.com?subject=Deal%20Readiness%20Discussion&body=Hi%20Josh,%0A%0AI'm%20interested%20in%20discussing%20how%20FRAQTIV%20can%20help%20prepare%20my%20company%20for%20sale.%0A%0ACompany:%20%0AIndustry:%20%0ARevenue%20Range:%20%0ACurrent%20Challenges:%20%0A%0AThank%20you!"
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-10 py-4 rounded-lg shadow-xl text-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-dark-bg hover:shadow-2xl"
          >
            Contact Us
          </a>
          <a
            href="tel:+19417357027"
            className="w-full sm:w-auto bg-dark-card hover:bg-slate-700 text-medium-text font-semibold px-8 py-4 rounded-lg shadow-xl text-lg transition-all duration-300 transform hover:scale-105 border border-slate-600 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-dark-bg hover:shadow-2xl"
          >
            Call (941) 735‑7027
          </a>
        </div>
        <p className="text-sm text-subtle-text">
          Contact your Broker or reach us directly — <a href="mailto:josh@fraqtiv.com" className="text-brand-primary hover:text-brand-secondary underline transition-colors duration-200">josh@fraqtiv.com</a>
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
