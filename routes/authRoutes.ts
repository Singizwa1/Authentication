import { Router } from 'express';
import passport from 'passport';
import { UserController } from '../controller/UserController';
import { ValidationMiddleware } from '../middlewares/validationMiddleware';

const Authrouter = Router();
const controller= new UserController;

Authrouter.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));


Authrouter.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    successRedirect: '/auth/success'
  })
);


Authrouter.get('/failure', controller.authFailure);


Authrouter.get('/success', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication successful',
    user: req.user
  });
});


Authrouter.get('/logout', controller.logout);


Authrouter.get('/profile', controller.getProfile);


Authrouter.get('/status', controller.getAuthStatus);

export default Authrouter;