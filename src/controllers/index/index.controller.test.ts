import { Request, Response } from 'express';
import { greet } from './index.controller';

const jsonMock = jest.fn();
const nextFn = jest.fn();

describe('controllers/index', () => {
  describe('greet', () => {
    const mockRequest = {
      ip: '127.0.0.1',
    } as unknown as Request;

    const mockResponse = {
      json: jsonMock,
    } as unknown as Response;

    it('should greet with message and ip', () => {
      greet(mockRequest, mockResponse, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith({
        message: 'Welcome to iTask server',
        ip: '127.0.0.1',
      });
    });
  });
});
