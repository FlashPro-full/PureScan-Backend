import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const isSMTPConfigured = (): boolean => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  return !!(emailUser && emailPass);
};

const getSMTPConfig = (): EmailConfig => {
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  const emailHost = process.env.SMTP_HOST;
  const emailPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const emailSecure = process.env.SMTP_SECURE === 'true';

  if (!emailUser || !emailPass) {
    throw new Error('SMTP credentials not configured. Set SMTP_USER and SMTP_PASS environment variables.');
  }

  if (emailHost) {
    return {
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };
  }

  const userEmail = emailUser.toLowerCase();
  
  if (userEmail.includes('@gmail.com')) {
    return {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };
  }
  
  if (userEmail.includes('@outlook.com') || userEmail.includes('@hotmail.com') || userEmail.includes('@live.com')) {
    return {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };
  }

  throw new Error('Unsupported email provider. Configure SMTP_HOST, SMTP_PORT, and SMTP_SECURE for custom SMTP.');
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    const config = getSMTPConfig();
    transporter = nodemailer.createTransport(config);
  }
  return transporter;
};

export const sendPasswordResetEmail = async (to: string, code: string): Promise<void> => {
  try {
    const transporter = getTransporter();
    const fromEmail = process.env.SMTP_USER || process.env.EMAIL_USER || 'noreply@purescan.com';

    await transporter.sendMail({
      from: `PureScan <${fromEmail}>`,
      to,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Password Reset Request</h2>
          <p>You requested to reset your password for your PureScan account.</p>
          <p>Your password reset code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #dc2626; font-size: 32px; letter-spacing: 8px; margin: 0;">${code}</h1>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">© ${new Date().getFullYear()} PureScan. All rights reserved.</p>
        </div>
      `,
      text: `
        Password Reset Request
        
        You requested to reset your password for your PureScan account.
        
        Your password reset code is: ${code}
        
        This code will expire in 15 minutes.
        
        If you didn't request this password reset, please ignore this email.
        
        © ${new Date().getFullYear()} PureScan. All rights reserved.
      `,
    });
  } catch (error: any) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send password reset email');
  }
};

