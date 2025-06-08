import React from 'react';

const ValueProposition: React.FC = () => {
  const metrics = [
    {
      value: "1–2×",
      label: "Multiple Expansion",
      description: "Driven by stronger tech posture, cleaner ops, and crystal‑clear revenue story"
    },
    {
      value: "60–90 days",
      label: "Value Barrier Removal",
      description: "Fast, focused transformation programs"
    },
    {
      value: "20+ years",
      label: "Operator Experience",
      description: "Josh Way's hands‑on leadership delivering transformation, not slide decks"
    },
    {
      value: "S3 Framework",
      label: "Lean‑to‑Scale System",
      description: "Cloud modernization, process automation, and business‑model validation"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-slate-800 via-slate-900 to-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-light-text mb-4">
            Why <span className="text-brand-primary">FRAQTIV</span> Gets Results
          </h2>
          <p className="text-lg md:text-xl text-medium-text max-w-4xl mx-auto">
            We don&apos;t just consult—we operate. Our team has built, scaled, and sold companies, bringing real-world experience to your exit preparation with proven frameworks and hands-on transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center group h-full">
              <div className="bg-dark-card p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-slate-700/50 hover:border-brand-primary/30 h-full flex flex-col">
                <div className="text-4xl md:text-5xl font-bold text-brand-primary mb-4 group-hover:text-brand-secondary transition-colors duration-300">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-light-text mb-3 min-h-[3.5rem] flex items-center justify-center">
                  {metric.label}
                </div>
                <div className="text-sm text-medium-text flex-grow flex items-center justify-center text-center">
                  {metric.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-dark-card p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="text-center">
            <blockquote className="text-xl md:text-2xl text-light-text italic mb-6 leading-relaxed">
              &ldquo;FRAQTIV is a specialist team built around an operator DNA, embedding with your leadership to remove structural friction and craft a premium, buyer‑ready growth narrative.&rdquo;
            </blockquote>
            <div className="text-brand-primary font-semibold text-lg">
              — Operator-led advisory removing deal‑killing red flags
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-light-text mb-4">
              <span className="text-brand-primary">Proven Outcomes</span> Across Industries
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-brand-secondary mb-3">Asset Tokenization Fintech</h4>
              <p className="text-sm text-medium-text flex-grow">KYC/AML‑integrated MVP in 16 weeks; investor onboarding ↓ 60%, regulatory review passed with zero findings.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-brand-secondary mb-3">IT Services Provider</h4>
              <p className="text-sm text-medium-text flex-grow">Revenue scaled past $1.5M run‑rate, customer retention ↑ 15% through standardized workflows and dashboards.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-brand-secondary mb-3">Orthopedic Practice Group</h4>
              <p className="text-sm text-medium-text flex-grow">Cloud EHR migration and automated billing; claim denial rate ↓ 22%, physician utilization ↑ 18%.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-brand-secondary mb-3">Industrial Engineering</h4>
              <p className="text-sm text-medium-text flex-grow">Lean production tracking; on‑time delivery ↑ 30%, gross margin ↑ 10% within six months.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-brand-secondary mb-3">Tech Field‑Support Firm</h4>
              <p className="text-sm text-medium-text flex-grow">Consolidated five tools into one PSA/RMM stack; ticket resolution ↓ 35%, EBITDA ↑ 12%.</p>
            </div>
            <div className="bg-dark-card p-6 rounded-xl border border-slate-700/50 h-full flex flex-col">
              <h4 className="text-lg font-semibold text-brand-secondary mb-3">Startup Accelerator Platform</h4>
              <p className="text-sm text-medium-text flex-grow">Built partner marketplace and automated investor reporting; platform adoption ↑ 3× and unlocked acquisition offers within six months.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition; 