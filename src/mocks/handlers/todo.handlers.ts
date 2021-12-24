import { rest } from 'msw';

import { Todo } from 'shared';
import { convertPathToNonStartRegex } from 'utils/common';
import { PaginationData } from 'typings/common';

import { createSearchTodosResolver } from '../resolvers/todos';

const todoAPIPath = '/api/v1/todos';

export const createSearchTodoSuccessHandler = (data: PaginationData<Todo>) =>
  rest.get(
    convertPathToNonStartRegex(todoAPIPath),
    createSearchTodosResolver(data),
  );

export const createSearchTodoFailedHandler = (
  errorMessage: string,
  statusCode: number = 403,
) =>
  rest.get(todoAPIPath, (_, res, ctx) =>
    res(
      ctx.status(statusCode),
      ctx.json({
        message: errorMessage,
      }),
    ),
  );
