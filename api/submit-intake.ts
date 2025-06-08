import type { VercelRequest, VercelResponse } from '@vercel/node';
import sgMail from '@sendgrid/mail';

// Security constants
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;
const MAX_FIELD_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[1-9][\d]{0,15}$/; // International phone format

// SendGrid configuration (server-side only)
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = 'jway@fraqtiv.com';
const ADMIN_EMAIL = 'jway@fraqtiv.com';

// Initialize SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();

// Types
interface IntakeFormData {
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

// Security utilities
const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, MAX_FIELD_LENGTH).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email) && email.length <= 254;
};

const isValidPhone = (phone: string): boolean => {
  // Remove formatting and check structure
  const cleaned = phone.replace(/[ \-().]/g, '');
  return PHONE_REGEX.test(cleaned) && cleaned.length >= 7 && cleaned.length <= 16;
};

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);
  
  if (!record) {
    rateLimitStore.set(identifier, { count: 1, firstRequest: now });
    return true;
  }
  
  // Reset if window expired
  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, { count: 1, firstRequest: now });
    return true;
  }
  
  // Check if limit exceeded
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
};

// Validation function
const validateFormData = (data: IntakeFormData): { isValid: boolean; errors: string[]; sanitizedData?: IntakeFormData } => {
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
  
  if (!sanitizedData.phoneNumber || !isValidPhone(sanitizedData.phoneNumber)) {
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

// Email templates (no logging of content)
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
    <a href="mailto:jway@fraqtiv.com" style="color: #4299e1;">jway@fraqtiv.com</a> | (941) 735-7027
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

// Secure email sending (no logging of content)
const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  if (!SENDGRID_API_KEY) {
    // Don't log email content in production
    return false;
  }

  try {
    const msg = {
      to: to,
      from: {
        email: FROM_EMAIL,
        name: 'FRAQTIV Team'
      },
      subject: subject,
      text: body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' '),
      html: body,
    };

    await sgMail.send(msg);
    // Only log success, not email content or addresses
    return true;
  } catch (error: unknown) {
    // Log errors without exposing sensitive information
    if (error instanceof Error) {
      console.error('Email sending failed:', error.message);
    }
    return false;
  }
};

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://fraqtiv.com' : '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    const data: IntakeFormData = req.body;
    
    // Rate limiting (use IP address as identifier)
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP.toString();
    
    if (!checkRateLimit(identifier)) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please wait a moment before trying again.'
      });
    }
    
    // Validate and sanitize input data
    const validation = validateFormData(data);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0]
      });
    }
    
    const sanitizedData = validation.sanitizedData!;
    
    // Send emails (don't expose email status to client for security)
    await sendEmail(
      sanitizedData.businessEmail,
      'Thank you for your interest in FRAQTIV',
      getUserEmailTemplate(sanitizedData)
    );
    
    await sendEmail(
      ADMIN_EMAIL,
      `New Intake Form Submission - ${sanitizedData.companyName}`,
      getAdminEmailTemplate(sanitizedData)
    );
    
    // Return success (don't expose email status to client)
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your information has been sent to our team.'
    });
    
  } catch (error) {
    // Don't expose internal error details
    return res.status(500).json({
      success: false,
      message: 'There was an error submitting your information. Please try again.'
    });
  }
} 