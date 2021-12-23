import { ErrorRequestHandler } from 'express';
import logger from 'utils/logger';

const errorMiddleware: ErrorRequestHandler = (error, req, res) => {
  const message = error.message || 'Something went wrong.';
  const statusCode = error.statusCode || 500;
  const correlationId = req.headers['correlation_id'];

  logger.error('ERROR', `correlationId=${correlationId}`, `message=${message}`);

  return res.status(statusCode).json({
    message,
  });
};

export default errorMiddleware;
