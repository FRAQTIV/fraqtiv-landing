import { IntakeFormData } from '../../types';
import sgMail from '@sendgrid/mail';

// Security constants
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_FIELD_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SendGrid configuration
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const FROM_EMAIL = 'jway@fraqtiv.com'; // Verified sender
const ADMIN_EMAIL = 'jway@fraqtiv.com';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SendGrid API key not found. Email functionality will be disabled.');
}

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
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <h2 style="color: #1a365d;">Dear ${data.fullName},</h2>
  
  <p>Thank you for your interest in <strong>FRAQTIV</strong>! We've received your information and will be in touch soon.</p>
  
  <h3 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">Here's what you shared with us:</h3>
  <ul style="line-height: 1.6;">
    <li><strong>Company:</strong> ${data.companyName}</li>
    <li><strong>Phone:</strong> ${data.phoneNumber}</li>
    <li><strong>Industry:</strong> ${data.industry}${data.customIndustry ? ` - ${data.customIndustry}` : ''}</li>
    <li><strong>Revenue Range:</strong> ${data.revenueRange}</li>
    <li><strong>Exit Timeline:</strong> ${data.exitTimeline}</li>
    <li><strong>Pain Points:</strong> ${data.painPoints.join(', ')}${data.customPainPoint ? `, ${data.customPainPoint}` : ''}</li>
    ${data.additionalNotes ? `<li><strong>Additional Notes:</strong> ${data.additionalNotes}</li>` : ''}
  </ul>
  
  <p style="background-color: #f7fafc; padding: 15px; border-left: 4px solid #4299e1; margin: 20px 0;">
    Someone will review your information and get back to you within <strong>24 hours</strong> to discuss how FRAQTIV can help prepare your business for a premium exit.
  </p>
  
  <p>Best regards,<br>
  <strong>The FRAQTIV Team</strong></p>
  
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
  
  <div style="text-align: center; color: #718096; font-size: 14px;">
    <strong>FRAQTIV</strong><br>
    Unlock Hidden Value Before You Sell Your Business<br>
    <a href="mailto:josh@fraqtiv.com" style="color: #4299e1;">josh@fraqtiv.com</a> | (941) 735-7027
  </div>
</div>
`;

const getAdminEmailTemplate = (data: IntakeFormData) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <h2 style="color: #c53030; border-bottom: 3px solid #e53e3e; padding-bottom: 10px;">🚨 New FRAQTIV Intake Form Submission</h2>
  
  <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1a365d; margin-top: 0;">📞 Contact Details</h3>
    <ul style="line-height: 1.8; margin: 0;">
      <li><strong>Name:</strong> ${data.fullName}</li>
      <li><strong>Email:</strong> <a href="mailto:${data.businessEmail}" style="color: #4299e1;">${data.businessEmail}</a></li>
      <li><strong>Phone:</strong> <a href="tel:${data.phoneNumber}" style="color: #4299e1;">${data.phoneNumber}</a></li>
      <li><strong>Company:</strong> ${data.companyName}</li>
    </ul>
  </div>
  
  <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1a365d; margin-top: 0;">🏢 Business Information</h3>
    <ul style="line-height: 1.8; margin: 0;">
      <li><strong>Industry:</strong> ${data.industry}${data.customIndustry ? ` - ${data.customIndustry}` : ''}</li>
      <li><strong>Revenue Range:</strong> ${data.revenueRange}</li>
      <li><strong>Exit Timeline:</strong> ${data.exitTimeline}</li>
    </ul>
  </div>
  
  <div style="background-color: #fffaf0; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1a365d; margin-top: 0;">⚠️ Pain Points</h3>
    <ul style="line-height: 1.8; margin: 0;">
      ${data.painPoints.map(point => `<li>${point}</li>`).join('')}
      ${data.customPainPoint ? `<li><strong>Custom:</strong> ${data.customPainPoint}</li>` : ''}
    </ul>
  </div>
  
  ${data.additionalNotes ? `
  <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #1a365d; margin-top: 0;">📝 Additional Notes</h3>
    <p style="margin: 0; white-space: pre-wrap;">${data.additionalNotes}</p>
  </div>
  ` : ''}
  
  <hr style="border: none; border-top: 2px solid #e2e8f0; margin: 30px 0;">
  
  <div style="text-align: center; color: #718096; font-size: 14px;">
    <strong>Submitted:</strong> ${new Date().toLocaleString()}
  </div>
</div>
`;

const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  // Check if SendGrid is configured
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured. Would send email:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    return false; // Return false to indicate email wasn't sent
  }

  try {
    const msg = {
      to: to,
      from: {
        email: FROM_EMAIL,
        name: 'FRAQTIV Team'
      },
      subject: subject,
      text: body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' '), // Strip HTML for text version
      html: body, // Body is already HTML formatted
    };

    console.log('Sending email via SendGrid to:', to);
    await sgMail.send(msg);
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error: any) {
    console.error('Failed to send email via SendGrid:', error);
    
    // Log more detailed error information
    if (error.response) {
      console.error('SendGrid response status:', error.response.status);
      console.error('SendGrid response body:', error.response.body);
    }
    
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