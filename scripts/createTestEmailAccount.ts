
import nodemailer from 'nodemailer';
import * as fs from 'fs/promises';
import * as path from 'path';
import dotenv from 'dotenv';    

dotenv.config();

async function createTestAccount() {
  try {
    
    const testAccount = await nodemailer.createTestAccount();

    console.log('Ethereal Email Test Account Created Successfully!');
    console.log('--------------------------------');
    console.log('Email: ' + testAccount.user);
    console.log('Password: ' + testAccount.pass);
    console.log('--------------------------------');

    // Read the current .env file
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = await fs.readFile(envPath, 'utf-8');

    // Replace the email credentials in the .env file
    envContent = envContent.replace(/EMAIL_USER=.*$/m, `EMAIL_USER=${testAccount.user}`);
    envContent = envContent.replace(/EMAIL_PASS=.*$/m, `EMAIL_PASS=${testAccount.pass}`);

    // Write the updated content back to .env
    await fs.writeFile(envPath, envContent);

    console.log('\nCredentials have been automatically updated in your .env file!');
    console.log('\nTest this account at: https://ethereal.email');
    console.log('Login with the email and password shown above.');
  } catch (error) {
    console.error('Error creating test account:', error);
  }
}

createTestAccount();
