import APIError from './APIError';

export const RECORD_NOT_FOUND = new APIError('Record is not found', 404);

export const INVALID_AUTHENTICATION_ERROR = new APIError(
  'Invalid authentication.',
  401,
);
export const ACCESS_ERROR = new APIError('Insufficient access rights.', 403);
export const REQUIRED_TOKEN_ERROR = new APIError('Missing access token.', 401);
export const INVALID_TOKEN_ERROR = new APIError('Invalid access token.', 401);
export const EXPIRED_TOKEN_ERROR = new APIError('Expired access token.', 401);
