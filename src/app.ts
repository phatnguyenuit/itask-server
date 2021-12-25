import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authMiddleware from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';
import apiRoutes from './routes/api';
import indexRoutes from './routes/index';
import { getEnv } from './utils/common';

const app = express();

// MIDDLEWARES

// LOGGING
app.use(morgan('combined'));

// CORS
app.use(
  cors({
    origin: getEnv('CORS_ORIGIN'),
  }),
);

// body parser
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// ROUTES
app.use('/', indexRoutes);
app.use('/api', authMiddleware, apiRoutes);

// ERROR HANDLER
app.use(errorMiddleware);

export default app;
