import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user || false);
  } catch (error) {
    done(error, false);
  }
});


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.CALLBACK_URL!
}, async (accessToken, refreshToken, profile, done) => {
  try {
    
    let user = await User.findOne({ 
      where: { googleId: profile.id } 
    });
    
    if (!user) {

      user = await User.findOne({ 
        where: { email: profile.emails?.[0]?.value } 
      });
      
      if (user) {
        
        await user.update({
          googleId: profile.id,
          name: profile.displayName,
          photo: profile.photos?.[0]?.value || '',
          lastLogin: new Date()
        });
      } else {
        
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

      await user.update({
        lastLogin: new Date(),
        photo: profile.photos?.[0]?.value || user.photo
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error as Error, false);
  }
}));

export default passport;