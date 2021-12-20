import { verify, sign, TokenExpiredError } from 'jsonwebtoken';
import { getEnv } from 'config/env';
import { INVALID_TOKEN_ERROR, EXPIRED_TOKEN_ERROR } from 'constants/errors';

const secretKey = getEnv('SECRET_KEY');
const expiresIn = getEnv('EXPIRES_IN');

export const generateToken = <TData extends string | Buffer | object>(
  data: TData,
): Promise<string> =>
  new Promise((resolve, reject) => {
    sign(
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
