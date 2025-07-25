import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Database } from '../database/db'; 
import dotenv from 'dotenv';

dotenv.config();

const { User } = Database; 

passport.serializeUser((user: any, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    console.log('Deserializing user ID:', id);
    
    if (!User) {
      throw new Error('User model not initialized');
    }
    
    const user = await User.findByPk(id);
    console.log('User found:', !!user);
    done(null, user || false);
  } catch (error) {
    console.error('Deserialization error:', error);
    done(error, false);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.CALLBACK_URL!
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile.id, profile.displayName);
    
    
    if (!User) {
      throw new Error('User model not available');
    }

    
    let user = await User.findOne({ 
      where: { googleId: profile.id } 
    });
    
    if (!user) {
      console.log('User not found by googleId, checking email...');
      
      
      user = await User.findOne({ 
        where: { email: profile.emails?.[0]?.value } 
      });
      
      if (user) {
        console.log('Linking existing user with Google account');
        
        await user.update({
          googleId: profile.id,
          name: profile.displayName,
          photo: profile.photos?.[0]?.value || '',
          lastLogin: new Date()
        });
      } else {
        console.log('Creating new user');
      
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          password: '', 
          role: 'user',
          gender: 'other',
          photo: profile.photos?.[0]?.value || ''
        });
      }
    } else {
      console.log('Updating existing Google user');
      
      await user.update({
        lastLogin: new Date(),
        photo: profile.photos?.[0]?.value || user.photo
      });
    }

    console.log('Authentication successful for user:', user.id);
    return done(null, user);
  } catch (error) {
    console.error('Google authentication error:', error);
    return done(error as Error, false);
  }
}));

export default passport;