import { loremIpsum } from 'lorem-ipsum';
import { Todo, CreateTodoPayload, UpdateTodoPayload } from 'shared';
import { PaginationData } from 'typings/common';

import TodoAPI from './todo.api';

const createFakeTodos = (size: number, userId: number) =>
  new Array(size).fill('').map<Todo>((_, index) => ({
    userId,
    id: index + 1,
    title: loremIpsum(),
    isCompleted: Math.random() > 0.5,
  }));

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();

jest.mock('apollo-datasource-rest', () => {
  class MockRESTDataSource {
    baseUrl = '';

    get = mockGet;
    post = mockPost;
    patch = mockPatch;
    delete = mockDelete;

    context = {
      headers: {
        'x-access-token': 'token',
      },
    };
  }
  return {
    RESTDataSource: MockRESTDataSource,
  };
});

describe('datasources/todo', () => {
  const todoAPI = new TodoAPI();
  const userId = 1;

  describe('searchTodo', () => {
    it('should return response when searching todos successfully', async () => {
      const todoResponseData: PaginationData<Todo> = {
        page: 1,
        pageSize: 5,
        total: 6,
        totalPages: 2,
        data: createFakeTodos(5, userId),
      };
      mockGet.mockResolvedValue({ data: todoResponseData });

      const data = await todoAPI.searchTodos(userId, {});

      expect(mockGet).toHaveBeenCalledWith('/', { userId });
      expect(data).toBe(todoResponseData);
    });

    it('should throw error when searching todos failed', async () => {
      const apiError = new Error('Failed to fetch.');
      mockGet.mockRejectedValue(apiError);

      try {
        await todoAPI.searchTodos(userId, {});
      } catch (error) {
        expect(error).toBe(apiError);
      }
    });

    it('should throw error when searching todos returns different structure', async () => {
      mockGet.mockResolvedValue({ data: { test: 1 } });

      try {
        await todoAPI.searchTodos(userId, {});
      } catch (error: any) {
        expect(error.message).toMatch('Invalid SearchTodosResponse');
      }
    });
  });

  describe('createTodo', () => {
    const todoPayload: CreateTodoPayload = {
      userId,
      title: 'Title',
      isCompleted: false,
    };

    it('should return response when creating todo successfully', async () => {
      const mockTodo: Todo = {
        ...todoPayload,
        id: 1,
      };
      mockPost.mockResolvedValue(mockTodo);

      const response = await todoAPI.createTodo(todoPayload);

      expect(mockPost).toHaveBeenCalledWith('/', todoPayload);
      expect(response).toBe(mockTodo);
    });

    it('should throw error when creating todo failed', async () => {
      const apiError = new Error('Failed to create.');
      mockPost.mockRejectedValue(apiError);

      try {
        await todoAPI.createTodo(todoPayload);
      } catch (error) {
        expect(error).toBe(apiError);
      }
    });

    it('should throw error when creating todo returns different structure', async () => {
      mockPost.mockResolvedValue({ data: { test: 1 } });

      try {
        await todoAPI.createTodo(todoPayload);
      } catch (error: any) {
        expect(error.message).toMatch('Invalid CreateTodoResponse');
      }
    });
  });

  describe('getTodo', () => {
    const todoId = 1;

    const mockTodo: Todo = {
      id: todoId,
      userId,
      title: 'Title',
      isCompleted: false,
    };

    it('should return response when getting todo successfully', async () => {
      mockGet.mockResolvedValue(mockTodo);

      const response = await todoAPI.getTodo(todoId);

      expect(mockGet).toHaveBeenCalledWith(`/${todoId}`);
      expect(response).toBe(mockTodo);
    });

    it('should throw error when getting todo failed', async () => {
      const apiError = new Error('Failed to request.');
      mockGet.mockRejectedValue(apiError);

      try {
        await todoAPI.getTodo(todoId);
      } catch (error) {
        expect(error).toBe(apiError);
      }
    });

    it('should throw error when not found', async () => {
      const notFoundError = new Error('Not found.');
      mockGet.mockRejectedValue(notFoundError);

      try {
        await todoAPI.getTodo(2);
      } catch (error) {
        expect(error).toBe(notFoundError);
      }
    });

    it('should throw error when getting todo returns different structure', async () => {
      mockGet.mockResolvedValue({ data: { test: 1 } });

      try {
        await todoAPI.getTodo(todoId);
      } catch (error: any) {
        expect(error.message).toMatch('Invalid GetTodoResponse');
      }
    });
  });

  describe('updateTodo', () => {
    const todoId = 1;

    const updateTodoPayload: UpdateTodoPayload = {
      isCompleted: false,
    };

    const mockTodo: Todo = {
      id: todoId,
      userId,
      title: 'Title',
      isCompleted: false,
    };

    it('should return response when updating todo successfully', async () => {
      mockPatch.mockResolvedValue(mockTodo);

      const response = await todoAPI.updateTodo(todoId, updateTodoPayload);

      expect(mockPatch).toHaveBeenCalledWith(`/${todoId}`, updateTodoPayload);
      expect(response).toBe(mockTodo);
    });

    it('should throw error when updating todo failed', async () => {
      const apiError = new Error('Failed to request.');
      mockPatch.mockRejectedValue(apiError);

      try {
        await todoAPI.updateTodo(todoId, updateTodoPayload);
      } catch (error) {
        expect(error).toBe(apiError);
      }
    });

    it('should throw error when not found', async () => {
      const notFoundError = new Error('Not found.');
      mockPatch.mockRejectedValue(notFoundError);

      try {
        await todoAPI.updateTodo(2, updateTodoPayload);
      } catch (error) {
        expect(error).toBe(notFoundError);
      }
    });

    it('should throw error when getting todo returns different structure', async () => {
      mockPatch.mockResolvedValue({ data: { test: 1 } });

      try {
        await todoAPI.updateTodo(todoId, updateTodoPayload);
      } catch (error: any) {
        expect(error.message).toMatch('Invalid UpdateTodoResponse');
      }
    });
  });

  describe('deleteTodo', () => {
    const todoId = 1;

    it('should return response when deleting todo successfully', async () => {
      mockDelete.mockResolvedValue(true);

      const response = await todoAPI.deleteTodo(todoId);

      expect(mockDelete).toHaveBeenCalledWith(`/${todoId}`);
      expect(response).toBe(true);
    });

    it('should throw error when deleting todo failed', async () => {
      const apiError = new Error('Failed to delete.');
      mockDelete.mockRejectedValue(apiError);

      try {
        await todoAPI.deleteTodo(todoId);
      } catch (error) {
        expect(error).toBe(apiError);
      }
    });

    it('should throw error when not found', async () => {
      const notFoundError = new Error('Not found.');
      mockDelete.mockRejectedValue(notFoundError);

      try {
        await todoAPI.deleteTodo(2);
      } catch (error) {
        expect(error).toBe(notFoundError);
      }
    });
  });
});
