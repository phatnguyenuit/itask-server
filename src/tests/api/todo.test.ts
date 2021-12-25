import { Todo } from '@prisma/client';
import supertest from 'supertest';
import { PaginationData } from 'typings/common';

import app from 'app';
import { createSearchTodosSuccessHandler } from 'mocks/handlers/todo.handlers';
import { mockServer } from 'mocks/server';

describe('api/v1/todos', () => {
  const request = supertest(app);

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
    it('should search todos successfully', async () => {
      const mockResponseData: PaginationData<Todo> = {
        page: 1,
        pageSize: 10,
        total: mockTodos.length,
        totalPages: 1,
        data: mockTodos,
      };
      // Mock search todos success response
      mockServer.use(createSearchTodosSuccessHandler(mockResponseData));

      const response = await request.get('/api/v1/todos');

      expect(response.body).toStrictEqual({
        data: mockResponseData,
      });
    });
  });
});
