import { IntakeFormData } from '../../types';

// Client-side API call to secure serverless function
const API_ENDPOINT = '/api/submit-intake';

export const submitIntakeForm = async (data: IntakeFormData): Promise<{ success: boolean; message: string }> => {
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