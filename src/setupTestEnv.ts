import { loadEnv } from './config/env';

// Setup NODE_ENV to 'test'
process.env.NODE_ENV = 'test';

// Load env files
loadEnv();
