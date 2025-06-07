import { IntakeFormData } from '../../types';

// Email templates
const getUserEmailTemplate = (data: IntakeFormData) => `
Dear ${data.fullName},

Thank you for your interest in FRAQTIV! We've received your information and will be in touch soon.

Here's what you shared with us:
• Company: ${data.companyName}
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
  console.log('Submitting intake form data:', data);
  
  // Validate required fields
  if (!data.fullName || !data.businessEmail || !data.companyName || !data.industry || 
      !data.revenueRange || !data.exitTimeline || !data.painPoints.length) {
    return {
      success: false,
      message: 'Please complete all required fields before submitting.'
    };
  }
  
  // Validate pain points
  if (data.painPoints.includes('Other') && !data.customPainPoint) {
    return {
      success: false,
      message: 'Please specify your custom pain point.'
    };
  }
  
  // Validate industry
  if (data.industry === 'Other' && !data.customIndustry) {
    return {
      success: false,
      message: 'Please specify your industry.'
    };
  }
  
  try {
    // Send confirmation email to user
    const userEmailSent = await sendEmail(
      data.businessEmail,
      'Thank you for your interest in FRAQTIV',
      getUserEmailTemplate(data)
    );
    
    // Send notification email to Josh
    const adminEmailSent = await sendEmail(
      'josh@fraqtiv.com',
      `New Intake Form Submission - ${data.companyName}`,
      getAdminEmailTemplate(data)
    );
    
    // Log email status
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
    return {
      success: false,
      message: 'There was an error submitting your information. Please try again.'
    };
  }
}; 