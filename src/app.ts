import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authMiddleware from './middlewares/auth.middleware';
import errorMiddleware from './middlewares/error.middleware';
import apiRoutes from './routes/api';
import { getEnv } from './utils/common';
// import logger from './utils/logger';

const app = express();

// MIDDLEWARES

// LOGGING
const mode = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
// logger.log(`Logging mode: ${JSON.stringify(mode)}`);

app.use(morgan(mode));

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
app.use('/api', authMiddleware, apiRoutes);

// ERROR HANDLER
app.use(errorMiddleware);

export default app;
