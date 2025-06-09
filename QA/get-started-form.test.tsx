import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MultiStepForm from '../components/MultiStepForm';
import * as intakeApi from '../src/api/intake';

// Mock the API call
jest.mock('../src/api/intake', () => ({
  submitIntakeForm: jest.fn(),
}));

const renderForm = () => {
  return render(
    <BrowserRouter>
      <MultiStepForm />
    </BrowserRouter>
  );
};

describe('Get Started Form User Journey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ CONFIRMED: Form correctly prevents auto-submit on Enter key press', async () => {
    const user = userEvent.setup();
    const mockSubmitIntakeForm = intakeApi.submitIntakeForm as jest.MockedFunction<typeof intakeApi.submitIntakeForm>;
    
    renderForm();

    // Fill out Step 1: Full Name
    await user.type(screen.getByPlaceholderText('John Smith'), 'John Doe');
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 2: Business Email
    await waitFor(() => {
      expect(screen.getByText('What\'s your business email?')).toBeVisible();
    });
    await user.type(screen.getByPlaceholderText('john@company.com'), 'john@example.com');
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 3: Phone Number
    await waitFor(() => {
      expect(screen.getByText('What\'s the best phone number for us to reach you?')).toBeVisible();
    });
    const phoneInput = screen.getByPlaceholderText('(555) 123-4567');
    
    // Use fireEvent to directly set the formatted value
    fireEvent.change(phoneInput, { target: { value: '(555) 123-4567' } });
    
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 4: Company Name
    await waitFor(() => {
      expect(screen.getByText('What\'s your company name?')).toBeVisible();
    });
    await user.type(screen.getByPlaceholderText('Acme Corporation'), 'Test Company');
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 5: Industry
    await waitFor(() => {
      expect(screen.getByText('What industry are you in?')).toBeVisible();
    });
    await user.click(screen.getByRole('radio', { name: 'IT Services' }));
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 6: Revenue Range
    await waitFor(() => {
      expect(screen.getByText('What\'s your annual revenue range?')).toBeVisible();
    });
    await user.click(screen.getByRole('radio', { name: '$5–10M' }));
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 7: Exit Timeline
    await waitFor(() => {
      expect(screen.getByText('What\'s your target exit timeline?')).toBeVisible();
    });
    await user.click(screen.getByRole('radio', { name: '12–24 months' }));
    await user.click(screen.getByText('Next'));

    // Wait for step transition and fill out Step 8: Pain Points (must select at least one)
    await waitFor(() => {
      expect(screen.getByText('What are your primary pain points? (Select all that apply)')).toBeVisible();
    });
    await user.click(screen.getByRole('button', { name: 'Legacy IT' }));
    await user.click(screen.getByText('Next'));

    // Wait for step transition to Step 9: Additional Notes
    await waitFor(() => {
      expect(screen.getByText('Anything else you\'d like our team to know?')).toBeVisible();
    });
    
    // Fill in additional notes using fireEvent for reliability
    const additionalNotesField = screen.getByPlaceholderText('Tell us more about your situation, specific challenges, or questions...');
    fireEvent.change(additionalNotesField, { target: { value: 'Test notes for Enter key test' } });
    
    // Ensure value is set
    await waitFor(() => {
      expect(additionalNotesField).toHaveValue('Test notes for Enter key test');
    });
    
    // Wait for the Submit button to appear (should be available on step 9)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    // Press Enter and check if form auto-submits (this is the bug we're testing for)
    await user.keyboard('{Enter}');

    // Check if the form auto-submitted (this reveals the bug)
    // Wait a moment to see if the form auto-submits
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockSubmitIntakeForm.mock.calls.length > 0) {
      // Bug exists: Form auto-submitted on Enter
      console.log('❌ BUG DETECTED: Form auto-submitted when Enter was pressed on final step');
      fail('Form should NOT auto-submit when Enter is pressed on the final step');
    } else {
      // Success: Form correctly prevented auto-submit on Enter
      console.log('✅ SUCCESS: Form correctly prevented auto-submit on Enter');
      expect(mockSubmitIntakeForm).not.toHaveBeenCalled();
      
      // Verify Submit button is available and ready
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toHaveAttribute('disabled');
      
      console.log('✅ TEST PASSED: Auto-submit prevention confirmed');
    }
  });

  test('should handle form submission with all required fields', async () => {
    const user = userEvent.setup();
    const mockSubmitIntakeForm = intakeApi.submitIntakeForm as jest.MockedFunction<typeof intakeApi.submitIntakeForm>;
    mockSubmitIntakeForm.mockResolvedValue({ success: true, message: 'Form submitted successfully!' });

    renderForm();

    // Fill out all steps with proper waiting
    // Step 1: Full Name
    await user.type(screen.getByPlaceholderText('John Smith'), 'John Doe');
    await user.click(screen.getByText('Next'));

    // Step 2: Business Email
    await waitFor(() => {
      expect(screen.getByText('What\'s your business email?')).toBeVisible();
    });
    await user.type(screen.getByPlaceholderText('john@company.com'), 'john@example.com');
    await user.click(screen.getByText('Next'));

    // Step 3: Phone Number
    await waitFor(() => {
      expect(screen.getByText('What\'s the best phone number for us to reach you?')).toBeVisible();
    });
    const phoneInput = screen.getByPlaceholderText('(555) 123-4567');
    
    // Use fireEvent to directly set the formatted value
    fireEvent.change(phoneInput, { target: { value: '(555) 123-4567' } });
    
    await user.click(screen.getByText('Next'));

    // Step 4: Company Name
    await waitFor(() => {
      expect(screen.getByText('What\'s your company name?')).toBeVisible();
    });
    await user.type(screen.getByPlaceholderText('Acme Corporation'), 'Test Company');
    await user.click(screen.getByText('Next'));

    // Step 5: Industry
    await waitFor(() => {
      expect(screen.getByText('What industry are you in?')).toBeVisible();
    });
    await user.click(screen.getByRole('radio', { name: 'IT Services' }));
    await user.click(screen.getByText('Next'));

    // Step 6: Revenue Range
    await waitFor(() => {
      expect(screen.getByText('What\'s your annual revenue range?')).toBeVisible();
    });
    await user.click(screen.getByRole('radio', { name: '$5–10M' }));
    await user.click(screen.getByText('Next'));

    // Step 7: Exit Timeline
    await waitFor(() => {
      expect(screen.getByText('What\'s your target exit timeline?')).toBeVisible();
    });
    await user.click(screen.getByRole('radio', { name: '12–24 months' }));
    await user.click(screen.getByText('Next'));

    // Step 8: Pain Points
    await waitFor(() => {
      expect(screen.getByText('What are your primary pain points? (Select all that apply)')).toBeVisible();
    });
    await user.click(screen.getByRole('button', { name: 'Legacy IT' }));
    await user.click(screen.getByText('Next'));

    // Step 9: Additional Notes
    await waitFor(() => {
      expect(screen.getByText('Anything else you\'d like our team to know?')).toBeVisible();
    });
    
    // Fill in additional notes using fireEvent for reliability
    const additionalNotesField = screen.getByPlaceholderText('Tell us more about your situation, specific challenges, or questions...');
    fireEvent.change(additionalNotesField, { target: { value: 'Test notes' } });
    
    // Wait for the input to be fully updated
    await waitFor(() => {
      expect(additionalNotesField).toHaveValue('Test notes');
    });
    
    // Submit button should be available on the final step
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
    
    // Add a small delay to ensure form state is stable
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Verify form submission with correct data
    await waitFor(() => {
      expect(mockSubmitIntakeForm).toHaveBeenCalledWith({
        fullName: 'John Doe',
        businessEmail: 'john@example.com',
        phoneNumber: '+1 (555) 123-4567',
        companyName: 'Test Company',
        industry: 'IT Services',
        revenueRange: '$5–10M',
        exitTimeline: '12–24 months',
        painPoints: ['Legacy IT'],
        additionalNotes: 'Test notes'
      });
    });

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
      expect(screen.getByText('Form submitted successfully!')).toBeInTheDocument();
    });
  });
}); 