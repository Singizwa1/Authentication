import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

class EmailService {
  private transporter!: nodemailer.Transporter;

  constructor() {
    this.initializeTransporter().catch(error => {
      console.error('Failed to initialize email transporter:', error);
    });
  }

  private async initializeTransporter() {
    try {
      let testAccount;
      
    
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('No email credentials found, creating test account...');
        testAccount = await nodemailer.createTestAccount();
        console.log('Test account created:');
        console.log('Email:', testAccount.user);
        console.log('Password:', testAccount.pass);
      }

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || testAccount?.user,
          pass: process.env.EMAIL_PASS || testAccount?.pass
        }
      });

      
      await this.transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      throw error;
    }
  }

  private async renderTemplate(templateName: string, data: any): Promise<string> {
    const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.ejs`);
    const template = await fs.readFile(templatePath, 'utf-8');
    return ejs.render(template, data);
  }

  async sendSubscriptionConfirmation(email: string, unsubscribeToken: string): Promise<void> {
    try {
      const html = await this.renderTemplate('subscription-confirmation', {
        unsubscribeUrl: `${process.env.APP_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`
      });

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Blog Newsletter" <newsletter@blog.com>',
        to: email,
        subject: "You've been subscribed!",
        html
      });
    } catch (error) {
      console.error('Error sending subscription confirmation:', error);
      throw new Error('Failed to send subscription confirmation email');
    }
  }

  async sendNewBlogNotification(subscribers: { email: string, unsubscribeToken: string }[], blogData: {
    title: string;
    description: string;
    url: string;
  }): Promise<void> {
    try {
      for (const subscriber of subscribers) {
        const html = await this.renderTemplate('new-blog-notification', {
          ...blogData,
          unsubscribeUrl: `${process.env.APP_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`
        });

        await this.transporter.sendMail({
          from: process.env.EMAIL_FROM || '"Blog Newsletter" <newsletter@blog.com>',
          to: subscriber.email,
          subject: `New Blog Post: ${blogData.title}`,
          html
        });
      }
    } catch (error) {
      console.error('Error sending blog notification:', error);
      throw new Error('Failed to send blog notification emails');
    }
  }
}

export const emailService = new EmailService();
