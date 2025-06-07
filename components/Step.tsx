import React, { useEffect, useRef } from 'react';

interface StepProps {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
}

const Step: React.FC<StepProps> = ({ title, children, isActive }) => {
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && stepRef.current) {
      stepRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isActive]);

  return (
    <div 
      ref={stepRef}
      className={`transition-all duration-500 ${
        isActive 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-4 pointer-events-none absolute'
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-light-text mb-8 text-center">
          {title}
        </h2>
        <div className="bg-dark-card p-8 rounded-2xl shadow-2xl border border-slate-700/50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Step; 