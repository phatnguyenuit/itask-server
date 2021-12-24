import { INVALID_TOKEN_ERROR, REQUIRED_TOKEN_ERROR } from 'constants/errors';
import { Request, Response, NextFunction } from 'express';

import * as authUtils from 'utils/auth';
import authMiddleware from './auth.middleware';

const statusMock = jest.fn();
const jsonMock = jest.fn();
const nextMock = jest.fn();
const verifyTokenMock = jest.spyOn(authUtils, 'verifyToken');

describe('authMiddleware', () => {
  const error = new Error('Fail to request.');

  const createRequest = (path: string, accessToken?: string) =>
    ({
      path,
      headers: {
        'x-access-token': accessToken,
      },
    } as unknown as Request);

  const mockResponse = {
    status: statusMock,
    json: jsonMock,
  } as unknown as Response;

  const nextFn = (...args: any[]) =>
    nextMock(...args) as unknown as NextFunction;

  it('should go next if req.path matches `/auth/*`', async () => {
    const request = createRequest('/api/v1/auth/test');

    await authMiddleware(request, mockResponse, nextFn);

    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith();
  });

  it('should redirect error if no access token provided', async () => {
    const request = createRequest('/api/v1/test');

    await authMiddleware(request, mockResponse, nextFn);

    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith(REQUIRED_TOKEN_ERROR);
  });

  it('should go next if the provided access token is valid', async () => {
    const request = createRequest('/api/v1/test', 'token');
    verifyTokenMock.mockResolvedValue({ pass: true });

    await authMiddleware(request, mockResponse, nextFn);

    expect(verifyTokenMock).toBeCalledWith('token');
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith();
  });

  it('should redirect to an error if the provided access token is invalid', async () => {
    const request = createRequest('/api/v1/test', 'token');
    verifyTokenMock.mockRejectedValue(INVALID_TOKEN_ERROR);

    await authMiddleware(request, mockResponse, nextFn);

    expect(verifyTokenMock).toBeCalledWith('token');
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith(INVALID_TOKEN_ERROR);
  });
});
