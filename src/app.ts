import express from 'express';
import cors from 'cors';

import { getEnv } from './config/env';
import errorMiddleware from './middlewares/error.middleware';
import apiRoutes from './routes/api';

const app = express();

// MIDDLEWARES
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
app.use('/api', apiRoutes);

// ERROR HANDLER
app.use(errorMiddleware);

export default app;
