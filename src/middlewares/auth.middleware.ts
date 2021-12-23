import { RequestHandler } from 'express';

import { REQUIRED_TOKEN_ERROR } from 'constants/errors';
import { verifyToken } from 'utils/auth';

const authMiddleware: RequestHandler = async (req, _, next) => {
  const accessToken = req.header('x-access-token');

  //   Ignore `/auth/*` routes
  if (req.path.includes('/auth')) {
    return next();
  }

  //   Raise error in case missing access token
  if (!accessToken) {
    return next(REQUIRED_TOKEN_ERROR);
  }

  try {
    await verifyToken(accessToken);
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
