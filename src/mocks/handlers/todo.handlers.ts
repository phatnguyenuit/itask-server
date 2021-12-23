import { rest } from 'msw';
import { Todo } from 'shared';
import { PaginationData } from 'typings/common';

const todoAPIPath = '/api/v1/todos';

export const createSearchTodoSuccessHandler = (data: PaginationData<Todo>) =>
  rest.get(todoAPIPath, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data,
      }),
      ctx.delay(),
    );
  });

export const createSearchTodoFailedHandler = (
  errorMessage: string,
  statusCode: number = 403,
) =>
  rest.get(todoAPIPath, (_, res, ctx) => {
    return res(
      ctx.status(statusCode),
      ctx.json({
        message: errorMessage,
      }),
      ctx.delay(),
    );
  });
