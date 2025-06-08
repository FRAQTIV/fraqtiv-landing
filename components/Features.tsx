import React from 'react';
import { FeatureItem } from '../types';

const DiagnosticIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-8 h-8"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16.5a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.611L5 14.5" />
  </svg>
);

const CloudIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-8 h-8"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
  </svg>
);

const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-8 h-8"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const servicesData: FeatureItem[] = [
  {
    id: 'diagnose',
    icon: <DiagnosticIcon className="w-10 h-10 text-brand-secondary" />,
    title: 'Diagnose (Week 0‑2)',
    description: 'Holistic scan of tech stack, processes, revenue engine, cost drivers, and partner network → heat‑map scorecard.',
  },
  {
    id: 'modernize-document',
    icon: <CloudIcon className="w-10 h-10 text-brand-secondary" />,
    title: 'Modernize & Document (Month 1‑3)',
    description: 'Implement quick‑win tech upgrades, codify SOPs, optimize cost base, and lock new pricing / packaging.',
  },
  {
    id: 'amplify-value',
    icon: <ChartIcon className="w-10 h-10 text-brand-secondary" />,
    title: 'Amplify Value Story (Month 3‑6)',
    description: 'Craft data‑backed growth narrative, KPI dashboards, and clean data room—all aligned to buyer personas.',
  },
];

const ServiceCard: React.FC<{ service: FeatureItem }> = ({ service }) => {
  return (
    <div className="bg-dark-card p-8 rounded-xl shadow-2xl transform hover:scale-[1.03] transition-all duration-300 ease-in-out flex flex-col items-center text-center md:items-start md:text-left hover:shadow-brand-primary/10 hover:shadow-2xl group">
      <div className="mb-6 p-4 bg-slate-700/50 rounded-full inline-block ring-2 ring-brand-primary/30 group-hover:ring-brand-primary/50 transition-all duration-300 group-hover:bg-slate-700/70">
        {service.icon}
      </div>
      <h3 className="text-2xl font-semibold text-light-text mb-3 group-hover:text-brand-secondary transition-colors duration-300">{service.title}</h3>
      <p className="text-medium-text leading-relaxed group-hover:text-light-text transition-colors duration-300">{service.description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-light-text mb-4">
            Our 3‑Step Path to <span className="text-brand-primary">&ldquo;List‑Ready&rdquo;</span>
          </h2>
          <p className="text-lg md:text-xl text-medium-text max-w-3xl mx-auto">
            FRAQTIV is a specialist team built around an operator DNA, embedding with your leadership to remove structural friction and craft a premium, buyer‑ready growth narrative.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
