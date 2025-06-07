// Check if tailwind is available before configuring
if (typeof window !== 'undefined' && window.tailwind) {
  window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0EA5E9', // sky-500
        'brand-secondary': '#38BDF8', // sky-400
        'dark-bg': '#0F172A', // slate-900
        'dark-card': '#1E293B', // slate-800
        'light-text': '#F8FAFC', // slate-50
        'medium-text': '#CBD5E1', // slate-300
        'subtle-text': '#94A3B8', // slate-400
      },
      animation: {
        'pulse-slow': 'pulse-custom 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.2' },
        }
      }
    }
  }
};
} 