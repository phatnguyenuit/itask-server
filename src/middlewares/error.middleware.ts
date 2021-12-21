import { ErrorRequestHandler } from 'express';
import logger from 'utils/logger';

const errorMiddleware: ErrorRequestHandler = (error, req, res, __) => {
  const message = error.message || 'Something went wrong.';
  const statusCode = error.statusCode || 500;
  const accessToken = req.headers['x-access-token'];
  const correlationId = req.headers['correlation_id'];

  logger.error('ERROR', `correlationId=${correlationId}`, `message=${message}`);

  return res.header('correlation_id', correlationId).status(statusCode).json({
    message,
    accessToken,
    correlationId,
  });
};

export default errorMiddleware;
