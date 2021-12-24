import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { INVALID_AUTHENTICATION_ERROR } from 'constants/errors';
import { prismaMock } from 'setupTests';
import * as encryption from 'utils/encryption';
import * as authUtils from 'utils/auth';

import { login } from './auth.controller';
import { LoginInput } from './auth.controller.types';

const nextMock = jest.fn();
const jsonMock = jest.fn();

const verifyMock = jest.spyOn(encryption, 'verify');
const generateTokenMock = jest.spyOn(authUtils, 'generateToken');
const jwtDecodeMock = jest.spyOn(jwt, 'decode');

// should prefix with mock to be able to use in mock module
const mockLogError = jest.fn();

jest.mock('utils/logger', () => ({
  error: (...args: any[]) => mockLogError(...args),
}));

const createRequest = <TBody>(body: TBody) =>
  ({
    body,
  } as unknown as Request);

const res = {
  json: jsonMock,
} as unknown as Response;

const nextFn = (...args: any[]) => nextMock(...args) as unknown as NextFunction;

const mockUser: User = {
  id: 1,
  email: 'test@local.com',
  name: 'Test',
  password: 'hashed-password',
};

describe('controllers/auth', () => {
  describe('login', () => {
    const req = createRequest<LoginInput>({
      email: 'test@local.com',
      password: '123@password',
    });

    it('should throw error when user not found', async () => {
      //   Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null);

      await login(req, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(INVALID_AUTHENTICATION_ERROR);
    });

    it('should throw error when wrong password provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      // Wrong password
      verifyMock.mockResolvedValue(false);

      await login(req, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(INVALID_AUTHENTICATION_ERROR);
    });

    it('should throw error when wrong data payload provided', async () => {
      const wrongReq = createRequest({ test: 'wrong-data' });

      await login(wrongReq, res, nextFn);

      const validationError = mockLogError.mock.calls[0][0];

      expect(mockLogError).toBeCalledTimes(1);
      expect(validationError.message).toMatch('Invalid LoginInput');

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(validationError);
    });

    it('should return jwt token after logged in successfully ', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      verifyMock.mockResolvedValue(true);
      generateTokenMock.mockResolvedValue('jwt-token');
      jwtDecodeMock.mockReturnValue({
        payload: {
          exp: 1000,
        },
      });

      await login(req, res, nextFn);

      expect(generateTokenMock).toBeCalledTimes(1);
      expect(generateTokenMock).toBeCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });

      expect(jwtDecodeMock).toBeCalledTimes(1);
      expect(jwtDecodeMock).toBeCalledWith('jwt-token', { complete: true });

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith({
        data: {
          expiredAt: 1000,
          accessToken: 'jwt-token',
        },
      });
    });
  });
});
