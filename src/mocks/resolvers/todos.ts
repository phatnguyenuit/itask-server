import { Todo } from '@prisma/client';
import { ResponseResolver, RestRequest, RestContext } from 'msw';
import { PaginationData } from 'typings/common';

export const createSearchTodosResolver =
  (data: PaginationData<Todo>): ResponseResolver<RestRequest, RestContext> =>
  (_, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        data,
      }),
    );
