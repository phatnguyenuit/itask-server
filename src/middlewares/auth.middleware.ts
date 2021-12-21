import { RequestHandler } from 'express';

import { getEnv } from 'config/env';
import { REQUIRED_TOKEN_ERROR } from 'constants/errors';
import { verifyToken } from 'utils/auth';
import logger from 'utils/logger';

const authMiddleware: RequestHandler = async (req, _, next) => {
  const accessToken = req.header('x-access-token');

  //   Ignore `/auth/*` routes
  if (req.path.includes('/auth')) {
    return next();
  }

  //   Raise error in case missing access token
  if (!accessToken) {
    logger.error('Unauthorized');
    return next(REQUIRED_TOKEN_ERROR);
  }

  try {
    const secretKey = getEnv('SECRET_KEY');
    await verifyToken(accessToken, secretKey);
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
