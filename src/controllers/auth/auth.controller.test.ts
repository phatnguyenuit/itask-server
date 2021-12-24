import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import APIError from 'constants/APIError';
import { INVALID_AUTHENTICATION_ERROR } from 'constants/errors';
import { prismaMock } from 'setupTests';
import * as encryption from 'utils/encryption';
import * as authUtils from 'utils/auth';

import { changePassword, login, signup } from './auth.controller';
import {
  ChangePasswordInput,
  LoginInput,
  SignupInput,
} from './auth.controller.types';

const nextMock = jest.fn();
const jsonMock = jest.fn();

const verifyMock = jest.spyOn(encryption, 'verify');
const encryptMock = jest.spyOn(encryption, 'encrypt');
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

const wrongReq = createRequest({ test: 'wrong-data' });

describe('controllers/auth', () => {
  describe('login', () => {
    const loginRequest = createRequest<LoginInput>({
      email: 'test@local.com',
      password: '123@password',
    });

    it('should throw error when wrong data payload provided', async () => {
      await login(wrongReq, res, nextFn);

      const validationError = mockLogError.mock.calls[0][0];

      expect(mockLogError).toBeCalledTimes(1);
      expect(validationError.message).toMatch('Invalid LoginInput');

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(validationError);
    });

    it('should throw error when user not found', async () => {
      //   Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null);

      await login(loginRequest, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(INVALID_AUTHENTICATION_ERROR);
    });

    it('should throw error when wrong password provided', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      // Wrong password
      verifyMock.mockResolvedValue(false);

      await login(loginRequest, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(INVALID_AUTHENTICATION_ERROR);
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

      await login(loginRequest, res, nextFn);

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

  describe('changePassword', () => {
    const changePasswordRequest = createRequest<ChangePasswordInput>({
      email: 'test@local.com',
      currentPassword: '123@password',
      newPassword: '123@password-new',
      rePassword: '123@password-new',
    });

    it('should throw error when wrong data payload provided', async () => {
      await changePassword(wrongReq, res, nextFn);

      const validationError = mockLogError.mock.calls[0][0];

      expect(mockLogError).toBeCalledTimes(1);
      expect(validationError.message).toMatch('Invalid ChangePasswordInput');

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(validationError);
    });

    it('should throw error when user not found', async () => {
      //   Mock user not found
      prismaMock.user.findUnique.mockResolvedValue(null);

      await changePassword(changePasswordRequest, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(INVALID_AUTHENTICATION_ERROR);
    });

    it('should throw error when the current password is wrong', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      // Wrong password
      verifyMock.mockResolvedValue(false);

      await changePassword(changePasswordRequest, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(INVALID_AUTHENTICATION_ERROR);
    });

    it('should throw error when new passwords are not matched together', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      verifyMock.mockResolvedValue(true);

      const notMatchedPasswordsReq = createRequest<ChangePasswordInput>({
        email: 'test@local.com',
        currentPassword: '123@password',
        newPassword: '123@password-new',
        rePassword: '123@password-re',
      });

      await changePassword(notMatchedPasswordsReq, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(
        new APIError('New passwords are not matched.', 400),
      );
    });

    it('should change password successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      verifyMock.mockResolvedValue(true);
      encryptMock.mockResolvedValue('hashed-password');
      prismaMock.user.update.mockResolvedValue(mockUser);

      await changePassword(changePasswordRequest, res, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith({
        message: 'Request successfully.',
      });
    });
  });

  describe('signup', () => {
    const signupRequest = createRequest<SignupInput>({
      email: 'hello@world.com',
      name: 'Hello',
      password: '123@OK.fine?',
      rePassword: '123@OK.fine?',
    });

    it('should throw error when wrong data payload provided', async () => {
      await signup(wrongReq, res, nextFn);

      const validationError = mockLogError.mock.calls[0][0];

      expect(mockLogError).toBeCalledTimes(1);
      expect(validationError.message).toMatch('Invalid SignupInput');

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(validationError);
    });

    it('should throw error when passwords are not matched together', async () => {
      const wrongPasswordRequest = createRequest<SignupInput>({
        email: 'hello@world.com',
        name: 'Hello',
        password: '123@OK.fine?',
        rePassword: '[diff]123@OK.fine?',
      });

      await signup(wrongPasswordRequest, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(
        new APIError('Passwords are not matched.', 400),
      );
    });

    it('should throw error when there is a existed user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await signup(signupRequest, res, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(new APIError('User is existed.', 400));
    });

    it('should signup new user successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      encryptMock.mockResolvedValue('hashed-password');
      prismaMock.user.create.mockResolvedValue(mockUser);

      await signup(signupRequest, res, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith({
        message: 'Request successfully.',
      });
    });
  });
});
