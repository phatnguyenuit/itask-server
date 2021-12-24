import { Request, Response, NextFunction } from 'express';

import APIError from 'constants/APIError';
import errorMiddleware from './error.middleware';

const statusMock = jest.fn();
const jsonMock = jest.fn();
const nextMock = jest.fn();

// should prefix with mock to be able to use in mock module
const mockLogError = jest.fn();

jest.mock('utils/logger', () => ({
  error: (...args: any[]) => mockLogError(...args),
}));

describe('errorMiddleware', () => {
  const error = new Error('Fail to request.');
  const apiError = new APIError('API error', 400);

  const request = {
    headers: { correlation_id: 'correlation_id' },
  } as unknown as Request;

  const mockResponse = {
    status: statusMock,
    json: jsonMock,
  } as unknown as Response;

  const nextFn = () => nextMock() as unknown as NextFunction;

  beforeEach(() => {
    statusMock.mockReturnValue(mockResponse);
    jsonMock.mockReturnValue(mockResponse);
  });

  it.each`
    error
    ${error}
    ${apiError}
  `('should respond with error message', ({ error }) => {
    errorMiddleware(error, request, mockResponse, nextFn);

    expect(jsonMock).toBeCalledWith({ message: error.message });
  });

  it.each`
    error
    ${error}
    ${apiError}
  `('should log error', ({ error }) => {
    errorMiddleware(error, request, mockResponse, nextFn);

    expect(mockLogError).toBeCalledWith(
      'ERROR',
      'correlationId=correlation_id',
      `message=${error.message}`,
    );
  });

  it('should respond with status code', () => {
    errorMiddleware(apiError, request, mockResponse, nextFn);

    expect(statusMock).toBeCalledWith(apiError.statusCode);
  });

  it('should respond with default error', () => {
    errorMiddleware({}, request, mockResponse, nextFn);

    expect(jsonMock).toBeCalledWith({ message: 'Something went wrong.' });
  });

  it('should respond with default status code=500', () => {
    errorMiddleware({}, request, mockResponse, nextFn);

    expect(statusMock).toBeCalledWith(500);
  });
});
