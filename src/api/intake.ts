import { IntakeFormData } from '../../types';

// Client-side API call to secure serverless function
const API_ENDPOINT = '/api/submit-intake';

// Check if we're in development mode
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const submitIntakeForm = async (data: IntakeFormData): Promise<{ success: boolean; message: string }> => {
  // Development mode mock
  if (isDevelopment) {
    console.log('Development mode: Simulating form submission');
    console.log('Form data:', data);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Development mode: Form submission simulated successfully!'
    };
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
      return {
        success: false,
        message: errorData.message || 'There was an error submitting your information. Please try again.'
      };
    }

    const result = await response.json();
    return result;

  } catch (error) {
    return {
      success: false,
      message: 'There was an error submitting your information. Please try again.'
    };
  }
}; 