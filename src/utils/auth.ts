import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { INVALID_TOKEN_ERROR, EXPIRED_TOKEN_ERROR } from 'constants/errors';
import { getEnv } from './common';

export const generateToken = <TData extends object>(
  data: TData,
): Promise<string> => {
  const expiresIn = getEnv('EXPIRES_IN');
  const secretKey = getEnv('SECRET_KEY');

  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      secretKey,
      { expiresIn },
      (error: Error | null, token: string | undefined) => {
        if (error) {
          reject(error);
        }

        if (!token) {
          return reject(new Error('Could not generate jwt token.'));
        }

        resolve(token);
      },
    );
  });
};

export const verifyToken = (token: string, options = {}) => {
  const secretKey = getEnv('SECRET_KEY');

  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, options, (error, data) => {
      if (error) {
        if (error instanceof TokenExpiredError) {
          reject(EXPIRED_TOKEN_ERROR);
        }

        reject(INVALID_TOKEN_ERROR);
      }

      resolve(data);
    });
  });
};
