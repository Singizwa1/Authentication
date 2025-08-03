import { emailService } from '../services/emailService';
import dotenv from 'dotenv';
import { sequelize } from '../database/db';
import { AllModal } from '../models';

dotenv.config();

async function testNewsletterSystem() {
  // Initialize models
  const models = AllModal(sequelize);
  const { Subscriber } = models;

  // Wait a moment for email transporter to initialize
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {

    console.log('Testing subscriber creation...');
    const testEmail = 'test@example.com';
    
    let subscriber = await Subscriber.findOne({ where: { email: testEmail } });
    if (subscriber) {
      await subscriber.destroy();
    }

    subscriber = await Subscriber.create({
      email: testEmail
    });

    console.log('Subscriber created successfully:', subscriber.id);


    console.log('\nTesting subscription confirmation email...');
    await emailService.sendSubscriptionConfirmation(
      subscriber.email,
      subscriber.unsubscribeToken
    );
    console.log('Confirmation email sent successfully');

    
    console.log('\nTesting blog notification email...');
    await emailService.sendNewBlogNotification(
      [{
        email: subscriber.email,
        unsubscribeToken: subscriber.unsubscribeToken
      }],
      {
        title: 'Test Blog Post',
        description: 'This is a test blog post description.',
        url: 'http://localhost:5000/blog/test'
      }
    );
    console.log('Blog notification email sent successfully');

    
    await subscriber.destroy();
    console.log('\nTest completed successfully!');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    try {
      await sequelize.close();
      console.log('Database connection closed.');
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
    process.exit();
  }
}


sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully');
    testNewsletterSystem();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });