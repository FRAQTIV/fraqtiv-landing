import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ProgressBar from './ProgressBar';
import Step from './Step';
import { IntakeFormData } from '../types';
import { submitIntakeForm } from '../src/api/intake';

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Email validation with common domain extensions
  const validateEmail = (email: string): boolean | string => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    // Check for common domain extensions
    const commonDomains = [
      'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'co', 'io', 'biz', 'info',
      'name', 'pro', 'museum', 'aero', 'coop', 'jobs', 'travel', 'mobi', 'asia',
      'cat', 'tel', 'post', 'geo', 'xxx', 'uk', 'us', 'ca', 'au', 'de', 'fr',
      'it', 'nl', 'be', 'ch', 'at', 'dk', 'fi', 'no', 'se', 'es', 'pt', 'ie',
      'pl', 'cz', 'hu', 'ro', 'bg', 'hr', 'si', 'sk', 'lt', 'lv', 'ee', 'ru',
      'ua', 'by', 'md', 'am', 'ge', 'az', 'kz', 'kg', 'tj', 'tm', 'uz', 'mn',
      'cn', 'jp', 'kr', 'tw', 'hk', 'sg', 'my', 'th', 'vn', 'ph', 'id', 'in',
      'pk', 'bd', 'lk', 'np', 'bt', 'mv', 'af', 'ir', 'iq', 'il', 'jo', 'lb',
      'sy', 'tr', 'cy', 'eg', 'ly', 'tn', 'dz', 'ma', 'sd', 'ke', 'tz', 'ug',
      'et', 'so', 'dj', 'er', 'mw', 'zm', 'zw', 'bw', 'na', 'sz', 'ls', 'mg',
      'mu', 'sc', 'km', 'za', 'ao', 'mz', 'zr', 'cg', 'cf', 'td', 'cm', 'gq',
      'ga', 'st', 'gw', 'cv', 'sn', 'gm', 'gn', 'sl', 'lr', 'ci', 'gh', 'tg',
      'bj', 'ne', 'bf', 'ml', 'mr', 'eh', 'br', 'ar', 'cl', 'co', 'ec', 'gy',
      'py', 'pe', 'sr', 'uy', 've', 'bo', 'cr', 'sv', 'gt', 'hn', 'ni', 'pa',
      'bz', 'mx', 'cu', 'do', 'ht', 'jm', 'tt', 'bb', 'gd', 'lc', 'vc', 'ag',
      'dm', 'kn', 'bs', 'pr', 'vi', 'ai', 'bm', 'ky', 'tc', 'vg', 'ms', 'gp',
      'mq', 'aw', 'cw', 'sx', 'bq', 'fk', 'gs', 'sh', 'ac', 'ta'
    ];
    
    const domain = email.split('@')[1];
    const extension = domain.split('.').pop()?.toLowerCase();
    
    if (extension && !commonDomains.includes(extension)) {
      return 'Please enter an email with a recognized domain extension';
    }
    
    return true;
  };

  const { register, handleSubmit, formState: { errors }, watch, trigger, setFocus, setValue, getValues } = useForm<IntakeFormData>({
    defaultValues: {
      painPoints: []
    }
  });

  // Register the painPoints field with validation
  register('painPoints', {
    required: 'Please select at least one pain point',
    validate: () => watchedPainPoints.length > 0 ? true : 'Please select at least one pain point'
  });

  const totalSteps = 9;

  const industryOptions = [
    'IT Services',
    'SaaS',
    'Healthcare',
    'Fintech',
    'Manufacturing',
    'Other'
  ];

  const watchedIndustry = watch('industry');

  const revenueOptions = [
    '<$5M',
    '$5–10M',
    '$10–25M',
    '$25–50M',
    '>$50M'
  ];

  const timelineOptions = [
    '<6 months',
    '6–12 months',
    '12–24 months',
    '>24 months',
    'Exploring'
  ];

  const painPointOptions = [
    'Legacy IT',
    'Messy Ops',
    'Pricing Clarity',
    'Revenue Concentration',
    'Cost Bloat',
    'Other'
  ];

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595' },
    { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
    { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
    { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
    { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218' },
    { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249' },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421' },
    { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386' },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸', dialCode: '+381' },
    { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', dialCode: '+387' },
    { code: 'ME', name: 'Montenegro', flag: '🇲🇪', dialCode: '+382' },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', dialCode: '+389' },
    { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355' },
    { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
    { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965' },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
    { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962' },
    { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961' },
    { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963' },
    { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964' },
    { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977' },
    { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975' },
    { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960' },
    { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93' },
    { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7' },
    { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998' },
    { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '+993' },
    { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', dialCode: '+992' },
    { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996' },
    { code: 'MN', name: 'Mongolia', flag: '🇲🇳', dialCode: '+976' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
    { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372' },
    { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371' },
    { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370' },
    { code: 'BY', name: 'Belarus', flag: '🇧🇾', dialCode: '+375' },
    { code: 'MD', name: 'Moldova', flag: '🇲🇩', dialCode: '+373' },
    { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374' },
    { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995' },
    { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
    { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
    { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354' },
    { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
    { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356' },
  ];

  const watchedPainPoints = watch('painPoints') || [];

  // Auto-focus when step changes
  useEffect(() => {
    const focusField = () => {
      setTimeout(() => {
        switch (currentStep) {
          case 1:
            setFocus('fullName');
            break;
          case 2:
            setFocus('businessEmail');
            break;
          case 3:
            setFocus('phoneNumber');
            break;
          case 4:
            setFocus('companyName');
            break;
          case 9:
            // Don't auto-focus on step 9 to prevent auto-submit
            // setFocus('additionalNotes');
            break;
          default:
            // For radio button steps, focus the first option
            {
              const firstRadio = document.querySelector(`input[type="radio"]`) as HTMLInputElement;
              if (firstRadio) {
                firstRadio.focus();
              }
            }
        }
      }, 100);
    };
    
    focusField();
  }, [currentStep, setFocus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.custom-phone-input')) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCountryDropdownOpen]);

  const nextStep = async () => {
    console.log(`nextStep called: currentStep=${currentStep}, totalSteps=${totalSteps}`);
    
    // Special handling for pain points step
    if (currentStep === 8) {
      console.log(`On step 8, painPoints selected: ${watchedPainPoints.length}`);
      if (watchedPainPoints.length === 0) {
        console.log('No pain points selected, staying on step 8');
        return; // Don't proceed if no pain points selected
      }
      if (watchedPainPoints.includes('Other')) {
        const isValid = await trigger(['customPainPoint']);
        if (!isValid) return;
      }
      console.log('Step 8 validation passed, advancing to step 9');
    } else {
      const fieldsToValidate = getFieldsForStep(currentStep);
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    
    if (currentStep < totalSteps) {
      console.log(`Advancing from step ${currentStep} to step ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
      
      // Check if advancing to step 9 triggers something
      if (currentStep + 1 === 9) {
        console.log('🔍 Advanced to step 9, checking for auto-submit triggers...');
      }
    } else {
      console.log(`Already at final step (${currentStep}), not advancing`);
    }
    // Note: Step 9 is the final step - form submission happens via Submit button, not nextStep()
  };

  // Handle Enter key press for navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Only allow nextStep navigation, not form submission
      if (currentStep < totalSteps) {
        nextStep();
      }
      // On step 9 (final step), Enter does nothing - require explicit Submit button click
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof IntakeFormData)[] => {
    switch (step) {
      case 1: return ['fullName'];
      case 2: return ['businessEmail'];
      case 3: return ['phoneNumber'];
      case 4: return ['companyName'];
      case 5: return watchedIndustry === 'Other' ? ['industry', 'customIndustry'] : ['industry'];
      case 6: return ['revenueRange'];
      case 7: return ['exitTimeline'];
      case 8: return watchedPainPoints.includes('Other') ? ['painPoints', 'customPainPoint'] : ['painPoints'];
      case 9: return []; // Optional field
      default: return [];
    }
  };

  const onSubmit = async (data: IntakeFormData) => {
    console.log('🚨 onSubmit called! This should only happen when Submit button is clicked');
    console.log('Current step:', currentStep);
    console.log('Call stack:', new Error().stack);
    console.log('Form data:', data);
    
    // Only allow submission on step 9
    if (currentStep !== 9) {
      console.log('❌ Preventing submission - not on final step');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Combine country code with phone number and use state for pain points
      const completePhoneNumber = `${selectedCountry.dialCode} ${data.phoneNumber}`.trim();
      const formDataWithFullPhone = {
        ...data,
        phoneNumber: completePhoneNumber,
        painPoints: watchedPainPoints  // Use state instead of form field
      };
      
      const result = await submitIntakeForm(formDataWithFullPhone);
      setSubmitMessage(result.message);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitMessage('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePainPoint = (painPoint: string) => {
    const current = watchedPainPoints;
    const updated = current.includes(painPoint)
      ? current.filter(p => p !== painPoint)
      : [...current, painPoint];
    
    // Update the form value manually since we're using custom UI
    setValue('painPoints', updated, { shouldValidate: true });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-dark-card p-12 rounded-2xl shadow-2xl border border-slate-700/50">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-light-text mb-4">Thank You!</h1>
            <p className="text-lg text-medium-text mb-8">{submitMessage}</p>
            <p className="text-medium-text mb-8">
              Someone will review your information and get back to you within 24 hours to discuss how FRAQTIV can help prepare your business for a premium exit.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log('Form submit event prevented - use Submit button instead');
        }} onKeyDown={handleKeyDown} className="relative">
          {/* Step 1: Full Name */}
          <Step title="What's your full name?" isActive={currentStep === 1}>
            <div className="space-y-4">
              <input
                {...register('fullName', { required: 'Full name is required' })}
                type="text"
                placeholder="John Smith"
                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm">{errors.fullName.message}</p>
              )}
            </div>
          </Step>

          {/* Step 2: Business Email */}
          <Step title="What's your business email?" isActive={currentStep === 2}>
            <div className="space-y-4">
              <input
                {...register('businessEmail', { 
                  required: 'Business email is required',
                  validate: validateEmail
                })}
                type="email"
                placeholder="john@company.com"
                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              {errors.businessEmail && (
                <p className="text-red-400 text-sm">{errors.businessEmail.message}</p>
              )}
            </div>
          </Step>

          {/* Step 3: Phone Number */}
          <Step title="What's the best phone number for us to reach you?" isActive={currentStep === 3}>
            <div className="space-y-4">
                              <div className="custom-phone-input">
                  <div 
                    className="country-selector"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  >
                    <span className="flag">{selectedCountry.flag}</span>
                    <span className="country-code">{selectedCountry.dialCode}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isCountryDropdownOpen && (
                    <div className="country-dropdown">
                      {countries.map((country) => (
                        <div
                          key={country.code}
                          className="country-option"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryDropdownOpen(false);
                          }}
                        >
                          <span className="flag">{country.flag}</span>
                          <span className="country-name">{country.name}</span>
                          <span className="dial-code">{country.dialCode}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <input
                    {...register('phoneNumber', { 
                      required: 'Phone number is required',
                      validate: (value) => {
                        if (!value) {
                          return 'Phone number is required';
                        }
                        const digitsOnly = value.replace(/\D/g, '');
                        if (selectedCountry.code === 'US' || selectedCountry.code === 'CA') {
                          if (digitsOnly.length !== 10) {
                            return 'Please enter a valid 10-digit phone number';
                          }
                        } else {
                          if (digitsOnly.length < 7) {
                            return 'Please enter a valid phone number';
                          }
                        }
                        return true;
                      }
                    })}
                    type="tel"
                    placeholder={selectedCountry.code === 'US' || selectedCountry.code === 'CA' ? "(555) 123-4567" : "Enter phone number"}
                    className="phone-number-input"
                    onChange={(e) => {
                      // Auto-format based on country
                      const input = e.target.value.replace(/\D/g, ''); // Remove non-digits
                      let formatted = '';
                      
                      if (selectedCountry.code === 'US' || selectedCountry.code === 'CA') {
                        // US/Canada format: (555) 123-4567
                        if (input.length > 0) {
                          if (input.length <= 3) {
                            formatted = `(${input}`;
                          } else if (input.length <= 6) {
                            formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
                          } else {
                            formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
                          }
                        }
                      } else {
                        // International format: improved spacing based on number length
                        if (input.length <= 2) {
                          formatted = input;
                        } else if (input.length <= 6) {
                          // Short international: XX XXX or XXX XXX
                          formatted = input.replace(/(\d{2,3})(\d{1,3})/, '$1 $2');
                        } else if (input.length <= 10) {
                          // Medium international: XX XXX XXXX or XXX XXX XXXX
                          formatted = input.replace(/(\d{2,3})(\d{3})(\d{1,4})/, '$1 $2 $3');
                        } else {
                          // Long international: XX XXX XXX XXXX
                          formatted = input.replace(/(\d{2,3})(\d{3})(\d{3})(\d{1,4})/, '$1 $2 $3 $4');
                        }
                      }
                      
                      // Update the form value and trigger validation
                      setValue('phoneNumber', formatted, { shouldValidate: true });
                      trigger('phoneNumber');
                    }}
                  />
                </div>
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm">{errors.phoneNumber.message}</p>
              )}
            </div>
          </Step>

          {/* Step 4: Company Name */}
          <Step title="What's your company name?" isActive={currentStep === 4}>
            <div className="space-y-4">
              <input
                {...register('companyName', { required: 'Company name is required' })}
                type="text"
                placeholder="Acme Corporation"
                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
              {errors.companyName && (
                <p className="text-red-400 text-sm">{errors.companyName.message}</p>
              )}
            </div>
          </Step>

          {/* Step 5: Industry */}
          <Step title="What industry are you in?" isActive={currentStep === 5}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industryOptions.map((industry) => (
                  <label key={industry} className="relative">
                    <input
                      {...register('industry', { required: 'Please select an industry' })}
                      type="radio"
                      value={industry}
                      className="peer sr-only"
                    />
                    <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:border-brand-primary transition-colors peer-checked:border-brand-primary peer-checked:bg-brand-primary/10">
                      <span className="text-light-text">{industry}</span>
                    </div>
                  </label>
                ))}
              </div>
              
              {watchedIndustry === 'Other' && (
                <div className="mt-4">
                  <input
                    {...register('customIndustry', { 
                      required: watchedIndustry === 'Other' ? 'Please specify your industry' : false 
                    })}
                    type="text"
                    placeholder="Please specify your industry"
                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    autoFocus
                  />
                  {errors.customIndustry && (
                    <p className="text-red-400 text-sm mt-2">{errors.customIndustry.message}</p>
                  )}
                </div>
              )}
            </div>
            {errors.industry && (
              <p className="text-red-400 text-sm mt-4">{errors.industry.message}</p>
            )}
          </Step>

          {/* Step 6: Revenue Range */}
          <Step title="What's your annual revenue range?" isActive={currentStep === 6}>
            <div className="space-y-3">
              {revenueOptions.map((range) => (
                <label key={range} className="relative block">
                  <input
                    {...register('revenueRange', { required: 'Please select a revenue range' })}
                    type="radio"
                    value={range}
                    className="peer sr-only"
                  />
                  <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:border-brand-primary transition-colors peer-checked:border-brand-primary peer-checked:bg-brand-primary/10">
                    <span className="text-light-text">{range}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.revenueRange && (
              <p className="text-red-400 text-sm mt-4">{errors.revenueRange.message}</p>
            )}
          </Step>

          {/* Step 7: Exit Timeline */}
          <Step title="What's your target exit timeline?" isActive={currentStep === 7}>
            <div className="space-y-3">
              {timelineOptions.map((timeline) => (
                <label key={timeline} className="relative block">
                  <input
                    {...register('exitTimeline', { required: 'Please select a timeline' })}
                    type="radio"
                    value={timeline}
                    className="peer sr-only"
                  />
                  <div className="p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:border-brand-primary transition-colors peer-checked:border-brand-primary peer-checked:bg-brand-primary/10">
                    <span className="text-light-text">{timeline}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.exitTimeline && (
              <p className="text-red-400 text-sm mt-4">{errors.exitTimeline.message}</p>
            )}
          </Step>

          {/* Step 8: Pain Points */}
          <Step title="What are your primary pain points? (Select all that apply)" isActive={currentStep === 8}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {painPointOptions.map((painPoint) => (
                  <button
                    key={painPoint}
                    type="button"
                    onClick={() => togglePainPoint(painPoint)}
                    className={`p-4 border rounded-lg transition-colors text-left ${
                      watchedPainPoints.includes(painPoint)
                        ? 'border-brand-primary bg-brand-primary/10 text-light-text'
                        : 'border-slate-600 bg-slate-700 text-light-text hover:border-brand-primary'
                    }`}
                  >
                    {painPoint}
                  </button>
                ))}
              </div>
              
              {watchedPainPoints.includes('Other') && (
                <div className="mt-4">
                  <input
                    {...register('customPainPoint', { 
                      required: watchedPainPoints.includes('Other') ? 'Please specify your pain point' : false 
                    })}
                    type="text"
                    placeholder="Please specify your pain point"
                    className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    autoFocus
                  />
                  {errors.customPainPoint && (
                    <p className="text-red-400 text-sm mt-2">{errors.customPainPoint.message}</p>
                  )}
                </div>
              )}
              
              {watchedPainPoints.length === 0 && (
                <p className="text-red-400 text-sm mt-4">Please select at least one pain point</p>
              )}
            </div>
          </Step>

          {/* Step 9: Additional Notes */}
          <Step title="Anything else you'd like our team to know?" isActive={currentStep === 9}>
            <div className="space-y-4">
              <textarea
                {...register('additionalNotes')}
                rows={6}
                placeholder="Tell us more about your situation, specific challenges, or questions..."
                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
              />
              <p className="text-sm text-subtle-text">This is optional but helps our team prepare for your conversation.</p>
            </div>
          </Step>

          {/* Privacy Statement */}
          <div className="mt-8 mb-6 text-center">
            <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
              <span className="font-medium">Privacy Notice:</span> FRAQTIV maintains a strict &apos;no-sell&apos; policy. Under no circumstances will we sell, rent, trade, or otherwise transfer to outside parties any personally identifiable information, except as required by law or with your explicit consent.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1
                  ? 'text-slate-500 cursor-not-allowed'
                  : 'text-medium-text hover:text-light-text'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Next
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  console.log('✅ Submit button clicked explicitly');
                  const formData = getValues();
                  await onSubmit(formData);
                }}
                disabled={isSubmitting}
                className="flex items-center bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm; 