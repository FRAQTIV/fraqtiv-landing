import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import ProgressBar from './ProgressBar';
import Step from './Step';
import { IntakeFormData } from '../types';
import { submitIntakeForm } from '../src/api/intake';

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

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

  const { register, handleSubmit, formState: { errors }, watch, trigger, setFocus, setValue } = useForm<IntakeFormData>({
    defaultValues: {
      painPoints: []
    }
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
            setFocus('additionalNotes');
            break;
          default:
            // For radio button steps, focus the first option
            const firstRadio = document.querySelector(`input[type="radio"]`) as HTMLInputElement;
            if (firstRadio) {
              firstRadio.focus();
            }
        }
      }, 100);
    };
    
    focusField();
  }, [currentStep, setFocus]);

  const nextStep = async () => {
    // Special validation for pain points step
    if (currentStep === 8) {
      if (watchedPainPoints.length === 0) {
        return; // Don't proceed if no pain points selected
      }
      if (watchedPainPoints.includes('Other')) {
        const isValid = await trigger(['customPainPoint']);
        if (!isValid) return;
      }
    } else {
      const fieldsToValidate = getFieldsForStep(currentStep);
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Enter key press for navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < totalSteps) {
        nextStep();
      } else {
        handleSubmit(onSubmit)();
      }
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
    setIsSubmitting(true);
    try {
      const result = await submitIntakeForm(data);
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
        
        <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="relative">
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
              <input
                {...register('phoneNumber', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-light-text placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
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
              <span className="font-medium">Privacy Notice:</span> FRAQTIV maintains a strict 'no-sell' policy. Under no circumstances will we sell, rent, trade, or otherwise transfer to outside parties any personally identifiable information, except as required by law or with your explicit consent.
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
                type="submit"
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