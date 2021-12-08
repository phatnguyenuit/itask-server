import { ErrorRequestHandler } from 'express';
import logger from 'utils/logger';

const errorMiddleware: ErrorRequestHandler = (error, _, res, __) => {
  logger.error(error);

  const message = error.message || 'Something went wrong.';
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message,
  });
};

export default errorMiddleware;
