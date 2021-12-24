import { Response, NextFunction } from 'express';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'constants/common';
import { prismaMock } from 'setupTests';
import { createMockRequest } from 'utils/testUtils';
import { createTodo, queryParamsMapping, searchTodos } from './todo.controller';
import { Todo } from '@prisma/client';
import { CreateTodoInput } from './todo.controller.types';
import APIError from 'constants/APIError';
import { CreateTodoPayload } from 'shared';

const jsonMock = jest.fn();
const nextMock = jest.fn();

const mockResponse = {
  json: jsonMock,
} as unknown as Response;

const nextFn = (...args: any[]) => nextMock(...args) as unknown as NextFunction;

describe('controllers/todo', () => {
  describe('queryParamsMapping', () => {
    const defaultParsedParams = {
      id: undefined,
      isCompleted: undefined,
      page: undefined,
      pageSize: undefined,
      title: undefined,
      userId: undefined,
    };

    const fullRawParams = {
      id: '123',
      isCompleted: 'true',
      page: '1',
      pageSize: '10',
      title: 'title',
      userId: '1',
    };

    const fullParsedParams = {
      id: 123,
      isCompleted: true,
      page: 1,
      pageSize: 10,
      title: 'title',
      userId: 1,
    };

    it.each`
      rawParams                   | expectedParams
      ${{}}                       | ${{}}
      ${{ userId: '123' }}        | ${{ userId: 123 }}
      ${{ id: '1' }}              | ${{ id: 1 }}
      ${{ title: 'title' }}       | ${{ title: 'title' }}
      ${{ isCompleted: 'true' }}  | ${{ isCompleted: true }}
      ${{ isCompleted: 'false' }} | ${{ isCompleted: false }}
      ${{ page: '1' }}            | ${{ page: 1 }}
      ${{ pageSize: '10' }}       | ${{ pageSize: 10 }}
      ${fullRawParams}            | ${fullParsedParams}
    `('should return parsed query params', ({ rawParams, expectedParams }) => {
      expect(queryParamsMapping(rawParams)).toStrictEqual({
        ...defaultParsedParams,
        ...expectedParams,
      });
    });
  });

  describe('searchTodos', () => {
    const mockTodos: Todo[] = [
      {
        id: 1,
        userId: 1,
        title: 'todo 1',
        isCompleted: false,
      },
      {
        id: 2,
        userId: 1,
        title: 'todo 2',
        isCompleted: false,
      },
    ];

    const emptySearchTodosRequest = createMockRequest({
      query: {},
    });

    it('should throw error when can not access database via Prisma', async () => {
      const databaseError = new Error('Can not reach out to database.');
      prismaMock.todo.count.mockRejectedValue(databaseError);

      await searchTodos(emptySearchTodosRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(databaseError);
    });

    describe('when no query params provided', () => {
      it('should return empty response', async () => {
        prismaMock.todo.count.mockResolvedValue(0);

        await searchTodos(emptySearchTodosRequest, mockResponse, nextFn);

        expect(jsonMock).toBeCalledTimes(1);
        expect(jsonMock).toBeCalledWith({
          data: {
            page: DEFAULT_PAGE,
            pageSize: DEFAULT_PAGE_SIZE,
            total: 0,
            totalPages: 0,
            data: [],
          },
        });
      });

      it('should return response with data', async () => {
        prismaMock.todo.count.mockResolvedValue(mockTodos.length);
        prismaMock.todo.findMany.mockResolvedValue(mockTodos);

        await searchTodos(emptySearchTodosRequest, mockResponse, nextFn);

        expect(jsonMock).toBeCalledTimes(1);
        expect(jsonMock).toBeCalledWith({
          data: {
            page: DEFAULT_PAGE,
            pageSize: DEFAULT_PAGE_SIZE,
            total: mockTodos.length,
            totalPages: 1,
            data: mockTodos,
          },
        });
      });
    });

    describe('when query params provided', () => {
      const searchTodosWithParamsRequest = createMockRequest({
        query: {
          page: '1',
          pageSize: '10',
          userId: '1',
          isCompleted: 'true',
        },
      });

      it('should return empty response', async () => {
        prismaMock.todo.count.mockResolvedValue(0);

        await searchTodos(searchTodosWithParamsRequest, mockResponse, nextFn);

        expect(jsonMock).toBeCalledTimes(1);
        expect(jsonMock).toBeCalledWith({
          data: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
            data: [],
          },
        });
      });

      it('should return response with data', async () => {
        prismaMock.todo.count.mockResolvedValue(mockTodos.length);
        prismaMock.todo.findMany.mockResolvedValue(mockTodos);

        await searchTodos(searchTodosWithParamsRequest, mockResponse, nextFn);

        expect(jsonMock).toBeCalledTimes(1);
        expect(jsonMock).toBeCalledWith({
          data: {
            page: 1,
            pageSize: 10,
            total: mockTodos.length,
            totalPages: 1,
            data: mockTodos,
          },
        });
      });
    });
  });

  describe('createTodo', () => {
    it('should throw error when wrong payload provided', async () => {
      const wrongPayloadRequest = createMockRequest({
        body: {
          wrongPayload: 'here!',
        },
      });

      await createTodo(wrongPayloadRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock.mock.calls[0][0].message).toMatch(
        'Invalid CreateTodoInput',
      );
    });

    it('should throw error when not existed userId provided', async () => {
      const wrongUserIdPayloadRequest = createMockRequest<CreateTodoInput>({
        body: {
          userId: 100,
          title: 'test',
          isCompleted: false,
        },
      });
      prismaMock.user.findUnique.mockResolvedValue(null);

      await createTodo(wrongUserIdPayloadRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(new APIError('User is not found', 404));
    });

    it('should create new todo successfully', async () => {
      const todoPayload: CreateTodoPayload = {
        userId: 1,
        title: 'test',
        isCompleted: false,
      };
      const createTodoRequest = createMockRequest<CreateTodoInput>({
        body: todoPayload,
      });

      const mockTodo: Todo = {
        ...todoPayload,
        id: 2,
      };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'test',
        email: 'test@local.com',
        password: 'hashed-password',
      });
      prismaMock.todo.create.mockResolvedValue(mockTodo);

      await createTodo(createTodoRequest, mockResponse, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith(mockTodo);
    });
  });
});
