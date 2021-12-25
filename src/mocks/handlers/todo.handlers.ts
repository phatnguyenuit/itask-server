import { rest } from 'msw';

import { Todo } from 'shared';
import { convertPathToNonStartRegex } from 'utils/common';
import { PaginationData } from 'typings/common';

import {
  createFailedResolver,
  createSuccessResolver,
} from '../resolvers/base.resolvers';
import { createSearchTodosResolver } from '../resolvers/todos.resolvers';

const todoAPIPath = '/api/v1/todos';

export const createSearchTodosSuccessHandler = (data: PaginationData<Todo>) =>
  rest.get(
    convertPathToNonStartRegex(todoAPIPath),
    createSearchTodosResolver(data),
  );

export const createSearchTodosFailedHandler = (
  errorMessage: string,
  statusCode: number,
) =>
  rest.get(
    convertPathToNonStartRegex(todoAPIPath),
    createFailedResolver(errorMessage, statusCode),
  );

export const createCreateTodoSuccessHandler = (todo: Todo) =>
  rest.post(
    convertPathToNonStartRegex(todoAPIPath),
    createSuccessResolver(todo),
  );

export const createGetTodoSuccessHandler = (todo: Todo) =>
  rest.get(
    convertPathToNonStartRegex(`${todoAPIPath}/:id`),
    createSuccessResolver(todo),
  );

export const createUpdateTodoSuccessHandler = (todo: Todo) =>
  rest.patch(
    convertPathToNonStartRegex(`${todoAPIPath}/:id`),
    createSuccessResolver(todo),
  );

export const deleteTodoSuccessHandler = rest.delete(
  convertPathToNonStartRegex(`${todoAPIPath}/:id`),
  createSuccessResolver({
    message: 'Request successfully.',
  }),
);
