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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to FRAQTIV</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #0f172a; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Header with Brand -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 40px 40px 30px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em;">
                FRAQTIV
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; color: #e0f7ff; font-weight: 500;">
                Unlock Hidden Value Before You Sell
              </p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 700; color: #f1f5f9; line-height: 1.2;">
                Dear ${data.fullName},
              </h2>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                Thank you for your interest in <strong style="color: #0ea5e9;">FRAQTIV</strong>! We've received your information and are excited to explore how we can help prepare your business for a premium exit.
              </p>
              
              <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px; padding: 24px; margin: 32px 0; border-left: 4px solid #0ea5e9;">
                <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #0ea5e9;">
                  📋 Your Submission Summary
                </h3>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #334155;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">COMPANY:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px;">${data.companyName}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #334155;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">PHONE:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px;">${data.phoneNumber}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #334155;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">INDUSTRY:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px;">${data.industry}${data.customIndustry ? ` - ${data.customIndustry}` : ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #334155;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">REVENUE RANGE:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px;">${data.revenueRange}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #334155;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">EXIT TIMELINE:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px;">${data.exitTimeline}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">PAIN POINTS:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px;">${data.painPoints.join(', ')}${data.customPainPoint ? `, ${data.customPainPoint}` : ''}</div>
                    </td>
                  </tr>
                  ${data.additionalNotes ? `
                  <tr>
                    <td style="padding: 8px 0; border-top: 1px solid #334155;">
                      <span style="font-weight: 600; color: #94a3b8; font-size: 14px;">ADDITIONAL NOTES:</span>
                      <div style="color: #f1f5f9; font-size: 16px; margin-top: 4px; white-space: pre-wrap;">${data.additionalNotes}</div>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <!-- Call to Action -->
              <div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 8px; padding: 24px; margin: 32px 0; text-align: center;">
                <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
                  🚀 What Happens Next?
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #d1fae5;">
                  Someone will review your information and get back to you within <strong style="color: #ffffff;">24 hours</strong> to discuss how FRAQTIV can help prepare your business for a premium exit.
                </p>
              </div>
              
              <p style="margin: 32px 0 0 0; font-size: 16px; line-height: 1.6; color: #cbd5e1;">
                Best regards,<br>
                <strong style="color: #f1f5f9; font-size: 18px;">The FRAQTIV Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 40px; text-align: center; border-top: 1px solid #334155;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <div style="margin-bottom: 16px;">
                      <span style="font-size: 20px; font-weight: 800; color: #0ea5e9; letter-spacing: -0.025em;">FRAQTIV</span>
                    </div>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                      Unlock Hidden Value Before You Sell Your Business
                    </p>
                    <div style="margin: 16px 0;">
                      <a href="mailto:jway@fraqtiv.com" style="color: #0ea5e9; text-decoration: none; font-weight: 600; margin-right: 20px;">jway@fraqtiv.com</a>
                      <a href="tel:+19417357027" style="color: #0ea5e9; text-decoration: none; font-weight: 600;">(941) 735-7027</a>
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 12px; color: #475569; line-height: 1.4;">
                      This email was sent because you submitted an intake form on our website.<br>
                      We maintain a strict no-sell policy and will never share your information.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getAdminEmailTemplate = (data: IntakeFormData) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New FRAQTIV Lead</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table cellpadding="0" cellspacing="0" border="0" width="700" style="max-width: 700px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Alert Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 24px 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">
                🚨 NEW INTAKE FORM SUBMISSION
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; color: #fecaca; font-weight: 500;">
                ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </td>
          </tr>
          
          <!-- Quick Actions -->
          <tr>
            <td style="background-color: #1e293b; padding: 20px 40px;">
              <div style="display: flex; justify-content: center; gap: 16px;">
                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="text-align: center;">
                      <a href="mailto:${data.businessEmail}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; margin-right: 12px;">
                        📧 Email ${data.fullName.split(' ')[0]}
                      </a>
                      <a href="tel:${data.phoneNumber}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 600; font-size: 14px;">
                        📱 Call ${data.fullName.split(' ')[0]}
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Contact Information -->
          <tr>
            <td style="padding: 32px 40px 0 40px;">
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; padding: 24px; border-left: 4px solid #3b82f6;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #1e40af; display: flex; align-items: center;">
                  📞 Contact Information
                </h2>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #cbd5e1;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; vertical-align: top;">
                            <span style="font-weight: 600; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Name</span>
                          </td>
                          <td>
                            <span style="color: #1e293b; font-size: 18px; font-weight: 600;">${data.fullName}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #cbd5e1;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; vertical-align: top;">
                            <span style="font-weight: 600; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                          </td>
                          <td>
                            <a href="mailto:${data.businessEmail}" style="color: #2563eb; font-size: 16px; text-decoration: none; font-weight: 500;">${data.businessEmail}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #cbd5e1;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; vertical-align: top;">
                            <span style="font-weight: 600; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
                          </td>
                          <td>
                            <a href="tel:${data.phoneNumber}" style="color: #2563eb; font-size: 16px; text-decoration: none; font-weight: 500;">${data.phoneNumber}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0;">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width: 120px; vertical-align: top;">
                            <span style="font-weight: 600; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Company</span>
                          </td>
                          <td>
                            <span style="color: #1e293b; font-size: 18px; font-weight: 600;">${data.companyName}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Business Information -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; padding: 24px; border-left: 4px solid #22c55e;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #166534;">
                  🏢 Business Profile
                </h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 16px 20px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                        <div style="text-align: center;">
                          <div style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Industry</div>
                          <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${data.industry}${data.customIndustry ? ` - ${data.customIndustry}` : ''}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 16px 20px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                        <div style="text-align: center;">
                          <div style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Revenue</div>
                          <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${data.revenueRange}</div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 16px;">
                  <tr>
                    <td style="padding: 16px 20px; background-color: #ffffff; border-radius: 6px; border: 1px solid #e5e7eb;">
                      <div style="text-align: center;">
                        <div style="font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Exit Timeline</div>
                        <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${data.exitTimeline}</div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Pain Points -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 8px; padding: 24px; border-left: 4px solid #f59e0b;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #92400e;">
                  ⚠️ Pain Points & Challenges
                </h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                  ${data.painPoints.map(point => `
                    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; text-align: center;">
                      <span style="font-size: 16px; font-weight: 600; color: #1f2937;">${point}</span>
                    </div>
                  `).join('')}
                </div>
                
                ${data.customPainPoint ? `
                <div style="margin-top: 16px; background-color: #ffffff; border: 2px dashed #f59e0b; border-radius: 6px; padding: 16px;">
                  <div style="font-size: 14px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Custom Pain Point</div>
                  <div style="font-size: 16px; color: #1f2937; font-style: italic;">"${data.customPainPoint}"</div>
                </div>
                ` : ''}
              </div>
            </td>
          </tr>
          
          ${data.additionalNotes ? `
          <!-- Additional Notes -->
          <tr>
            <td style="padding: 24px 40px 0 40px;">
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; padding: 24px; border-left: 4px solid #0ea5e9;">
                <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0c4a6e;">
                  📝 Additional Notes
                </h2>
                <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151; white-space: pre-wrap; font-style: italic;">"${data.additionalNotes}"</p>
                </div>
              </div>
            </td>
          </tr>
          ` : ''}
          
          <!-- Priority Assessment -->
          <tr>
            <td style="padding: 24px 40px 32px 40px;">
              <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 8px; padding: 24px; border-left: 4px solid #ec4899; text-align: center;">
                <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #be185d;">
                  🎯 Lead Priority Assessment
                </h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 20px;">
                  <div style="background-color: #ffffff; border-radius: 6px; padding: 16px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Revenue Size</div>
                    <div style="font-size: 18px; font-weight: 800; color: ${
                                             data.revenueRange.includes('25M') || data.revenueRange.includes('>$50M') 
                         ? '#10b981' : data.revenueRange === '<$5M' 
                        ? '#f59e0b' : '#3b82f6'
                    };">
                      ${data.revenueRange.includes('25M') || data.revenueRange.includes('>$50M') ? 'HIGH' : 
                        data.revenueRange === '<$5M' ? 'SMALL' : 'MEDIUM'}
                    </div>
                  </div>
                  
                  <div style="background-color: #ffffff; border-radius: 6px; padding: 16px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Timeline</div>
                    <div style="font-size: 18px; font-weight: 800; color: ${
                      data.exitTimeline.includes('<6') || data.exitTimeline.includes('6–12') 
                        ? '#ef4444' : data.exitTimeline.includes('Exploring') 
                        ? '#6b7280' : '#3b82f6'
                    };">
                      ${data.exitTimeline.includes('<6') || data.exitTimeline.includes('6–12') ? 'URGENT' : 
                        data.exitTimeline.includes('Exploring') ? 'EARLY' : 'PLANNED'}
                    </div>
                  </div>
                  
                  <div style="background-color: #ffffff; border-radius: 6px; padding: 16px; border: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Pain Count</div>
                    <div style="font-size: 18px; font-weight: 800; color: ${
                      data.painPoints.length >= 4 ? '#ef4444' : 
                      data.painPoints.length >= 2 ? '#f59e0b' : '#3b82f6'
                    };">
                      ${data.painPoints.length >= 4 ? 'CRITICAL' : 
                        data.painPoints.length >= 2 ? 'MODERATE' : 'LOW'}
                    </div>
                  </div>
                </div>
                
                <div style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-radius: 6px; border: 2px solid #ec4899;">
                  <strong style="color: #be185d; font-size: 16px;">
                    📞 Recommended Response Time: 
                    ${data.exitTimeline.includes('<6') || data.painPoints.length >= 4 ? 
                      '<2 hours (High Priority)' : 
                      data.exitTimeline.includes('6–12') || data.painPoints.length >= 2 ? 
                      '<4 hours (Medium Priority)' : 
                      '<24 hours (Standard)'}
                  </strong>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Secure email sending (no logging of content)
const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  if (!SENDGRID_API_KEY) {
    // Development mode: simulate email sending without actually sending
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: Email would be sent to:', to.substring(0, 3) + '***');
      return true; // Simulate success in development
    }
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