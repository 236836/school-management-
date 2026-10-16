// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"School Management System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Email Templates
export const welcomeEmailTemplate = (name, role) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0;">🏫 School Management System</h1>
    </div>
    <div style="padding: 30px; background: #f9f9f9;">
      <h2>Welcome, ${name}! 🎉</h2>
      <p>Your account has been created successfully as a <strong>${role}</strong>.</p>
      <p>You can now login to your dashboard and access all features.</p>
      <a href="${process.env.FRONTEND_URL}/login" 
         style="background: #667eea; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">
        Login to Dashboard
      </a>
    </div>
    <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
      <p>© 2024 School Management System. All rights reserved.</p>
    </div>
  </div>
`;