import { NextFunction, Response } from 'express';
import { createMockRequest } from 'utils/testUtils';
import { searchUserTodos } from './user.controller';

const redirectMock = jest.fn();
const nextMock = jest.fn();

const mockResponse = {
  redirect: redirectMock,
} as unknown as Response;

const nextFn = (...args: any[]) => nextMock(...args) as unknown as NextFunction;

describe('controllers/user', () => {
  describe('searchUserTodos', () => {
    it('should redirect to search todos path with query params', () => {
      const mockRequest = createMockRequest({
        params: { userId: '1' },
      });
      searchUserTodos(mockRequest, mockResponse, nextFn);

      expect(redirectMock).toBeCalledTimes(1);
      expect(redirectMock).toBeCalledWith('/api/v1/todos?userId=1');
    });

    it('should redirect to search todos path with combined query params', () => {
      const mockRequest = createMockRequest({
        params: { userId: '1' },
        query: {
          id: '1',
          isCompleted: 'true',
        },
      });
      searchUserTodos(mockRequest, mockResponse, nextFn);

      expect(redirectMock).toBeCalledTimes(1);
      expect(redirectMock).toBeCalledWith(
        '/api/v1/todos?id=1&isCompleted=true&userId=1',
      );
    });
  });
});
