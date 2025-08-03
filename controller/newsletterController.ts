import { Request, Response } from 'express';
import { Subscriber } from '../models/subscriber';
import { emailService } from '../services/emailService';
import { ResponseService } from '../utils/response';
import { subscribeSchema } from '../schema/subscribeSchema';


export class NewsletterController {
  async subscribe(req: Request, res: Response) {
    try {
      
      const { error, value } = subscribeSchema.validate(req.body);
      if (error) {
        return ResponseService({
          res,  
            status: 400,
            success: false,
            message: error.details[0].message
        });
      }

      
      const existingSubscriber = await Subscriber.findOne({
        where: { email: value.email }
      });

      if (existingSubscriber) {
        if (!existingSubscriber.isActive) {
        
          existingSubscriber.isActive = true;
          await existingSubscriber.save();
          await emailService.sendSubscriptionConfirmation(value.email, existingSubscriber.unsubscribeToken);
          return ResponseService({
            status: 200,
            success: true,
            message: 'Subscription reactivated successfully',
            res
          })
        }
        return ResponseService({
          status: 400, 
            success: false,
            message: 'You are already subscribed to the newsletter',
            res
        });
      }

      
      const subscriber = await Subscriber.create({
        email: value.email
      });

      
      await emailService.sendSubscriptionConfirmation(value.email, subscriber.unsubscribeToken);

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed to newsletter'
      });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process subscription'
      });
    }
  }

  async unsubscribe(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid unsubscribe token'
        });
      }

      const subscriber = await Subscriber.findOne({
        where: { unsubscribeToken: token }
      });

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Subscription not found'
        });
      }

      subscriber.isActive = false;
      await subscriber.save();

      res.status(200).json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      });
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process unsubscribe request'
      });
    }
  }

  async notifyNewBlog(blogData: {
    title: string;
    description: string;
    url: string;
  }) {
    try {
      const activeSubscribers = await Subscriber.findAll({
        where: { isActive: true }
      });

      if (activeSubscribers.length === 0) {
        return;
      }

      const subscriberData = activeSubscribers.map(subscriber => ({
        email: subscriber.email,
        unsubscribeToken: subscriber.unsubscribeToken
      }));

      await emailService.sendNewBlogNotification(subscriberData, blogData);
    } catch (error) {
      console.error('Blog notification error:', error);
      throw new Error('Failed to send blog notifications');
    }
  }
}

export const newsletterController = new NewsletterController();
