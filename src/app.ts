import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';

// replace mpromise of mongoose by default promise
mongoose.Promise = global.Promise;

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

// Controllers (route handlers)
import * as index from './controllers/index';
import * as auth from './controllers/authentication';
import * as user from './controllers/user';
import * as expense from './controllers/expense';

// Passport configuration
import './config/passport';
import * as passportConfig from './config/passport';

// Create Express server
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }).then(() => {
  /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
}).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  // process.exit();
});

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

/**
 * Routes.
 */
app.get('/', index.home);
app.post('/register', auth.register);
app.post('/login', auth.login);
app.get('/profile', passportConfig.isAuthenticated, user.getCurrentUserProfile);
app.get('/expenses', passportConfig.isAuthenticated, expense.getExpenseList);
app.get('/expenses/:id', passportConfig.isAuthenticated, expense.getSingleExpense);
app.put('/expenses/:id', passportConfig.isAuthenticated, expense.updateExpense);
app.delete('/expenses/:id', passportConfig.isAuthenticated, expense.deleteSingleExpense);
app.post('/expenses', passportConfig.isAuthenticated, expense.createExpense);

export default app;
