import { Todo } from '@prisma/client';
import { Response, NextFunction } from 'express';

import APIError from 'constants/APIError';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'constants/common';
import { RECORD_NOT_FOUND } from 'constants/errors';
import { prismaMock } from 'setupTests';
import { createMockRequest } from 'utils/testUtils';

import { CreateTodoInput, UpdateTodoInput } from './todo.controller.types';
import {
  createTodo,
  deleteTodo,
  getTodo,
  queryParamsMapping,
  searchTodos,
  TodoIdPathParams,
  updateTodo,
  verifyTodoId,
} from './todo.controller';

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
      const todoPayload: CreateTodoInput = {
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

  describe('verifyTodoId', () => {
    it.each`
      id
      ${''}
      ${'text'}
      ${'0'}
      ${'-1'}
    `('should raise error when provided id="$id"', async ({ id }) => {
      const request = createMockRequest<any, any, TodoIdPathParams>({
        params: { id },
      });

      await verifyTodoId(request, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(new APIError('Wrong ID provided.', 400));
    });

    it('should raise error when provided not existed todo id', async () => {
      const request = createMockRequest<any, any, TodoIdPathParams>({
        params: { id: '100' },
      });
      prismaMock.todo.findUnique.mockResolvedValue(null);

      await verifyTodoId(request, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(RECORD_NOT_FOUND);
    });

    it('should raise error when Prisma client throw error', async () => {
      const request = createMockRequest<any, any, TodoIdPathParams>({
        params: { id: '100' },
      });

      const databaseError = new Error('Could not connect to database.');
      prismaMock.todo.findUnique.mockRejectedValue(databaseError);

      await verifyTodoId(request, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(databaseError);
    });

    it('should move to next handler when found todo with the provided id', async () => {
      const request = createMockRequest<any, any, TodoIdPathParams>({
        params: { id: '1' },
      });

      prismaMock.todo.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        title: 'test',
        isCompleted: false,
      });

      await verifyTodoId(request, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith();
    });
  });

  describe('updateTodo', () => {
    it('should raise error when provided wrong payload', async () => {
      const wrongPayloadRequest = createMockRequest<any, any, TodoIdPathParams>(
        {
          params: { id: '1' },
          body: {
            payload: 'wrong',
          },
        },
      );

      await updateTodo(wrongPayloadRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock.mock.calls[0][0].message).toMatch(
        'Invalid UpdateTodoInput',
      );
    });

    const updateTodoPayloadRequest = createMockRequest<
      UpdateTodoInput,
      any,
      TodoIdPathParams
    >({
      params: { id: '1' },
      body: {
        isCompleted: true,
      },
    });

    it('should raise error when updating todo throws error', async () => {
      const prismaError = new Error('Failed to update.');
      prismaMock.todo.update.mockRejectedValue(prismaError);

      await updateTodo(updateTodoPayloadRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(prismaError);
    });

    it('should update todo successfully', async () => {
      const mockTodo: Todo = {
        id: 1,
        userId: 1,
        isCompleted: true,
        title: 'test',
      };
      prismaMock.todo.update.mockResolvedValue(mockTodo);

      await updateTodo(updateTodoPayloadRequest, mockResponse, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith(mockTodo);
    });
  });

  describe('getTodo', () => {
    const getTodoRequest = createMockRequest<any, any, TodoIdPathParams>({
      params: { id: '100' },
    });

    it('should raise error when Prisma client throw error', async () => {
      const prismaError = new Error('Could not connect to database.');
      prismaMock.todo.findUnique.mockRejectedValue(prismaError);

      await getTodo(getTodoRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(prismaError);
    });

    it('should get todo successfully', async () => {
      const mockTodo: Todo = {
        id: 1,
        userId: 1,
        title: 'test',
        isCompleted: false,
      };

      prismaMock.todo.findUnique.mockResolvedValue(mockTodo);

      await getTodo(getTodoRequest, mockResponse, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith(mockTodo);
    });
  });

  describe('deleteTodo', () => {
    const deleteTodoRequest = createMockRequest<any, any, TodoIdPathParams>({
      params: { id: '100' },
    });

    it('should raise error when Prisma client throw error', async () => {
      const prismaError = new Error('Could not connect to database.');
      prismaMock.todo.delete.mockRejectedValue(prismaError);

      await deleteTodo(deleteTodoRequest, mockResponse, nextFn);

      expect(nextMock).toBeCalledTimes(1);
      expect(nextMock).toBeCalledWith(prismaError);
    });

    it('should delete todo successfully', async () => {
      const mockTodo: Todo = {
        id: 1,
        userId: 1,
        title: 'test',
        isCompleted: false,
      };

      prismaMock.todo.delete.mockResolvedValue(mockTodo);

      await deleteTodo(deleteTodoRequest, mockResponse, nextFn);

      expect(jsonMock).toBeCalledTimes(1);
      expect(jsonMock).toBeCalledWith({
        message: 'Request successfully.',
      });
    });
  });
});
