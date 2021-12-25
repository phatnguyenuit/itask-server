import { RequestHandler } from 'express';

import { REQUIRED_TOKEN_ERROR } from 'constants/errors';
import { verifyToken } from 'utils/auth';

const authMiddleware: RequestHandler = async (req, _, next) => {
  const accessToken = req.headers['x-access-token'];

  //   Ignore `/auth/*` routes
  if (/\/auth\/.*/.test(req.path)) {
    return next();
  }

  //   Raise error in case missing access token
  if (!accessToken) {
    return next(REQUIRED_TOKEN_ERROR);
  }

  try {
    await verifyToken(String(accessToken));
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
