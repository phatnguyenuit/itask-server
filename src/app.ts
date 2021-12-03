import express from 'express';
import apiRoutes from './routes/api';

const app = express();

// MIDDLEWARES

// request body parser
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

// ROUTES
app.use('/api', apiRoutes);

export default app;
