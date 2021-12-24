import { Todo } from '@prisma/client';
import supertest from 'supertest';

import app from '../app';
import { mockServer } from 'mocks/server';
import { createSearchTodoSuccessHandler } from 'mocks/handlers/user.handlers';

const basePath = '/api/v1/users';

describe(basePath, () => {
  const request = supertest(app);

  describe('/:userId/todos', () => {
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
    it('should respond with list of todos', async () => {
      mockServer.use(
        createSearchTodoSuccessHandler({
          data: mockTodos,
          page: 1,
          pageSize: 5,
          total: 2,
          totalPages: 1,
        }),
      );

      const response = await request
        .get(`${basePath}/1/todos`)
        .set('x-access-token', 'token')
        .redirects(1); // move to 1 redirects

      expect(response.body).toStrictEqual({
        data: {
          total: 2,
          totalPages: 1,
          page: 1,
          pageSize: 5,
          data: mockTodos,
        },
      });
    });
  });
});
