# Email Integration Setup

The FRAQTIV intake form currently includes mock email functionality. To enable real email sending in production, follow these steps:

## Email Service Integration

### Option 1: SendGrid (Recommended)
1. Sign up for SendGrid account
2. Install SendGrid package: `npm install @sendgrid/mail`
3. Get API key from SendGrid dashboard
4. Update `src/api/intake.ts` sendEmail function:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  try {
    await sgMail.send({
      to,
      from: 'noreply@fraqtiv.com', // Use verified sender
      subject,
      text: body,
    });
    return true;
  } catch (error) {
    console.error('SendGrid error:', error);
    return false;
  }
};
```

### Option 2: AWS SES
1. Set up AWS SES in your AWS console
2. Install AWS SDK: `npm install @aws-sdk/client-ses`
3. Update sendEmail function with SES implementation

### Option 3: Nodemailer with SMTP
1. Install Nodemailer: `npm install nodemailer @types/nodemailer`
2. Configure with your SMTP provider

## Environment Variables
Add to your `.env` file:
```
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@fraqtiv.com
ADMIN_EMAIL=josh@fraqtiv.com
```

## Current Email Flow
When a form is submitted:
1. User receives confirmation email with their submission details
2. Josh receives notification email with full form data
3. Both emails are sent simultaneously
4. Form submission succeeds even if emails fail (graceful degradation)

## Testing
- Test with real email addresses in development
- Verify both user confirmation and admin notification emails
- Check spam folders initially
- Validate email templates render correctly 