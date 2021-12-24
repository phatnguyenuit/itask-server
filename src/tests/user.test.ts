import { Todo } from '@prisma/client';
import supertest from 'supertest';
import { prismaMock } from 'setupTests';

import app from '../app';
import * as authUtils from '../utils/auth';

const verifyTokenMock = jest.spyOn(authUtils, 'verifyToken');

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
      verifyTokenMock.mockResolvedValue({});
      prismaMock.todo.count.mockResolvedValue(mockTodos.length);
      prismaMock.todo.findMany.mockResolvedValue(mockTodos);

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
