import { rest } from 'msw';

import { Todo } from 'shared';
import { PaginationData } from 'typings/common';
import { convertPathToNonStartRegex } from 'utils/common';

import { createSearchTodosResolver } from '../resolvers/todos.resolvers';

const userAPIPath = '/api/v1/users';

export const createSearchTodoSuccessHandler = (data: PaginationData<Todo>) =>
  rest.get(
    convertPathToNonStartRegex(`${userAPIPath}/:userId/todos`),
    createSearchTodosResolver(data),
  );
