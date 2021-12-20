import { verify, TokenExpiredError } from 'jsonwebtoken';
import { INVALID_TOKEN_ERROR, EXPIRED_TOKEN_ERROR } from 'constants/errors';

export const verifyToken = (token: string, secretKey: string, options = {}) => {
  return new Promise((resolve, reject) => {
    verify(token, secretKey, options, (err, data) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          reject(EXPIRED_TOKEN_ERROR);
        }

        reject(INVALID_TOKEN_ERROR);
      }

      resolve(data);
    });
  });
};
