import { IntakeFormData } from '../../types';

// Security constants
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_FIELD_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

// Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, MAX_FIELD_LENGTH); // Limit length
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 254; // RFC 5321 limit
};

// Rate limiting check
const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
};

// Validate and sanitize form data
const validateAndSanitizeFormData = (data: IntakeFormData): { isValid: boolean; errors: string[]; sanitizedData?: IntakeFormData } => {
  const errors: string[] = [];
  
  // Sanitize all string fields
  const sanitizedData: IntakeFormData = {
    fullName: sanitizeInput(data.fullName || ''),
    businessEmail: sanitizeInput(data.businessEmail || '').toLowerCase(),
    phoneNumber: sanitizeInput(data.phoneNumber || ''),
    companyName: sanitizeInput(data.companyName || ''),
    industry: sanitizeInput(data.industry || ''),
    customIndustry: data.customIndustry ? sanitizeInput(data.customIndustry) : undefined,
    revenueRange: sanitizeInput(data.revenueRange || ''),
    exitTimeline: sanitizeInput(data.exitTimeline || ''),
    painPoints: Array.isArray(data.painPoints) ? data.painPoints.map(p => sanitizeInput(p)) : [],
    customPainPoint: data.customPainPoint ? sanitizeInput(data.customPainPoint) : undefined,
    additionalNotes: data.additionalNotes ? sanitizeInput(data.additionalNotes) : undefined
  };
  
  // Validate required fields
  if (!sanitizedData.fullName || sanitizedData.fullName.length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }
  
  if (!sanitizedData.businessEmail || !isValidEmail(sanitizedData.businessEmail)) {
    errors.push('Please provide a valid business email address');
  }
  
  if (!sanitizedData.phoneNumber || sanitizedData.phoneNumber.length < 10) {
    errors.push('Please provide a valid phone number');
  }
  
  if (!sanitizedData.companyName || sanitizedData.companyName.length < 2) {
    errors.push('Company name must be at least 2 characters long');
  }
  
  if (!sanitizedData.industry) {
    errors.push('Please select an industry');
  }
  
  if (!sanitizedData.revenueRange) {
    errors.push('Please select a revenue range');
  }
  
  if (!sanitizedData.exitTimeline) {
    errors.push('Please select an exit timeline');
  }
  
  if (!sanitizedData.painPoints || sanitizedData.painPoints.length === 0) {
    errors.push('Please select at least one pain point');
  }
  
  // Validate conditional fields
  if (sanitizedData.industry === 'Other' && !sanitizedData.customIndustry) {
    errors.push('Please specify your industry');
  }
  
  if (sanitizedData.painPoints.includes('Other') && !sanitizedData.customPainPoint) {
    errors.push('Please specify a particular pain point');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

// Email templates
const getUserEmailTemplate = (data: IntakeFormData) => `
Dear ${data.fullName},

Thank you for your interest in FRAQTIV! We've received your information and will be in touch soon.

Here's what you shared with us:
• Company: ${data.companyName}
• Phone: ${data.phoneNumber}
• Industry: ${data.industry}${data.customIndustry ? ` - ${data.customIndustry}` : ''}
• Revenue Range: ${data.revenueRange}
• Exit Timeline: ${data.exitTimeline}
• Pain Points: ${data.painPoints.join(', ')}${data.customPainPoint ? `, ${data.customPainPoint}` : ''}
${data.additionalNotes ? `• Additional Notes: ${data.additionalNotes}` : ''}

Someone will review your information and get back to you within 24 hours to discuss how FRAQTIV can help prepare your business for a premium exit.

Best regards,
The FRAQTIV Team

---
FRAQTIV
Unlock Hidden Value Before You Sell Your Business
josh@fraqtiv.com | (941) 735-7027
`;

const getAdminEmailTemplate = (data: IntakeFormData) => `
New FRAQTIV Intake Form Submission

Contact Details:
• Name: ${data.fullName}
• Email: ${data.businessEmail}
• Phone: ${data.phoneNumber}
• Company: ${data.companyName}

Business Information:
• Industry: ${data.industry}${data.customIndustry ? ` - ${data.customIndustry}` : ''}
• Revenue Range: ${data.revenueRange}
• Exit Timeline: ${data.exitTimeline}

Pain Points:
${data.painPoints.map(point => `• ${point}`).join('\n')}${data.customPainPoint ? `\n• ${data.customPainPoint}` : ''}

${data.additionalNotes ? `Additional Notes:\n${data.additionalNotes}` : ''}

---
Submitted: ${new Date().toLocaleString()}
`;

const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  // In a real implementation, this would use a service like SendGrid, AWS SES, or similar
  console.log('Sending email to:', to);
  console.log('Subject:', subject);
  console.log('Body:', body);
  
  // For now, simulate successful email sending
  // In production, replace this with actual email service integration
  try {
    // Mock API call - replace with actual email service
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const submitIntakeForm = async (data: IntakeFormData): Promise<{ success: boolean; message: string }> => {
  console.log('Submitting intake form data (sanitized)');
  
  // Rate limiting (use email as identifier)
  const identifier = data.businessEmail || 'anonymous';
  if (!checkRateLimit(identifier)) {
    return {
      success: false,
      message: 'Too many submissions. Please wait a moment before trying again.'
    };
  }
  
  // Validate and sanitize input data
  const validation = validateAndSanitizeFormData(data);
  if (!validation.isValid) {
    return {
      success: false,
      message: validation.errors[0] // Return first error
    };
  }
  
  const sanitizedData = validation.sanitizedData!;
  
  try {
    // Send confirmation email to user
    const userEmailSent = await sendEmail(
      sanitizedData.businessEmail,
      'Thank you for your interest in FRAQTIV',
      getUserEmailTemplate(sanitizedData)
    );
    
    // Send notification email to Josh
    const adminEmailSent = await sendEmail(
      'josh@fraqtiv.com',
      `New Intake Form Submission - ${sanitizedData.companyName}`,
      getAdminEmailTemplate(sanitizedData)
    );
    
    // Log email status (but don't expose internal errors to user)
    if (!userEmailSent) {
      console.warn('Failed to send confirmation email to user');
    }
    if (!adminEmailSent) {
      console.warn('Failed to send notification email to admin');
    }
    
    // Return success even if emails fail (form submission is primary goal)
    return {
      success: true,
      message: 'Thank you! Your information has been sent to our team.'
    };
  } catch (error) {
    console.error('Error submitting form:', error);
    // Don't expose internal error details to user
    return {
      success: false,
      message: 'There was an error submitting your information. Please try again.'
    };
  }
}; 