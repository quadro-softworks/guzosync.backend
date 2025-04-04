// src/core/services/email.service.ts
import nodemailer from 'nodemailer';
import { injectable } from 'tsyringe';
import config from '@core/config';

export interface IEmailService {
  sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void>;
  sendPasswordResetEmail(to: string, token: string): Promise<void>;
}

@injectable()
export class NodemailerEmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Only configure transporter if host/auth details are present
    if (config.email.host && config.email.auth.user && config.email.auth.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure, // true for 465, false for other ports
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass,
        },
      });
      console.log('Email service configured.');
    } else {
      console.warn(
        'Email service transporter not created due to missing configuration.',
      );
      // Create a dummy transporter or handle appropriately
      this.transporter = {
        sendMail: async () =>
          console.error('Email not sent: Service not configured.'),
      } as any;
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    if (!this.transporter || typeof this.transporter.sendMail !== 'function') {
      console.error(`Email not sent to ${to}: Service not configured.`);
      // Optionally throw an error or return silently based on requirements
      // throw new Error('Email service is not configured.');
      return;
    }

    const mailOptions = {
      from: config.email.from,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      // For Ethereal testing:
      if (config.email.host === 'smtp.ethereal.email') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      // Decide if you want to throw error upwards
      throw new Error('Failed to send email.');
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    // Construct the reset URL (adjust path as needed for your client app)
    // const resetUrl = `<span class="math-inline">\{config\.clientUrl\}/reset\-password?token\=</span>{token}`; // Example client path

    const resetUrl = config.clientUrl + '/reset-password?token=' + token;
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Please use the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.\nThis link will expire in 10 minutes.`; // TODO: Make expiry dynamic if needed
    const html = `<p>You requested a password reset. Please click the link below to reset your password:</p>
                    <p>
                      <a href="${resetUrl}" 
                        style="display:inline-block; padding:12px 24px; background-color:#4f46e5; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold; font-family:sans-serif;">
                        Reset Password
                      </a>
                    </p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>This link will expire in 10 minutes.</p>`; // TODO: Make expiry dynamic

    await this.sendEmail(to, subject, text, html);
  }
}

// Define Meta for DI registration token
export const IEmailServiceMeta = { name: 'IEmailService' };
