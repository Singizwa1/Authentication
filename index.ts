import express from "express";
import session from "express-session"; 
import passport from "./config/passport"; 
import { config } from "dotenv";
import { Database } from "./database/db";
import { router } from "./routes";
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger'
import newsletterRouter from "./routes/newsletterRoutes"

config();


Database; 

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET||"another",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 4 * 60 * 60 * 1000 
  }
}));


app.use(passport.initialize());
app.use(passport.session());

process.env.APP_URL = process.env.APP_URL || 'http://localhost:5000'
 process.env.EMAIL_FROM = process.env.EMAIL_FROM || 'newsletter@myblog.com'

app.use('/', router); 
app.use('/api/newsletter', newsletterRouter)

app.get('/blogs/:id', (req, res) => {
    res.redirect(`/api/v1/blogs/${req.params.id}`);
});

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("Hello Rwanda");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Visit http://127.0.0.1:${port}/auth/google to test Google login`);
});