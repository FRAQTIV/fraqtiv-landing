import React from 'react';

export interface FeatureItem {
  id: string;
  icon: React.ReactElement;
  title: string;
  description: string;
}

export interface IntakeFormData {
  fullName: string;
  businessEmail: string;
  phoneNumber: string;
  companyName: string;
  industry: string;
  customIndustry?: string;
  revenueRange: string;
  exitTimeline: string;
  painPoints: string[];
  customPainPoint?: string;
  additionalNotes?: string;
}
