import { RequestHandler, Request } from 'express';
import filter from 'lodash/filter';
import { loremIpsum } from 'lorem-ipsum';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'constants/common';
import { Todo } from 'shared';
import { paginate } from 'utils/paginate';
import { removeNullableProperties } from 'utils/common';

const NUM_OF_TODOS_PER_USER = 10;

const USER_IDS = new Array(10).fill('').map((_, index) => index + 1);
const TODOS_PER_USER: Record<string, Todo[]> = USER_IDS.reduce(
  (result, userId, userIndex) => {
    const startTodoId = userIndex * NUM_OF_TODOS_PER_USER + 1;

    const todos = new Array(NUM_OF_TODOS_PER_USER).fill('').map((_, index) => ({
      id: startTodoId + index,
      userId,
      title: loremIpsum(),
      completed: Math.random() > 0.5,
    }));

    return Object.assign(result, { [userId]: todos });
  },
  {},
);

const TODOS = Object.values(TODOS_PER_USER).flat();

const queryParamsMapping = (queryParams: Request['query']) => {
  const { userId, id, completed, title, page, pageSize } = queryParams;

  return {
    userId: Boolean(userId) ? Number(userId) : undefined,
    id: Boolean(id) ? Number(id) : undefined,
    title: Boolean(title) ? String(title) : undefined,
    completed: Boolean(completed) ? completed === 'true' : undefined,
    page: Boolean(page) ? Number(page) : undefined,
    pageSize: Boolean(pageSize) ? Number(pageSize) : undefined,
  };
};

export const searchTodos: RequestHandler = (req, res) => {
  const {
    userId,
    id,
    completed,
    title,
    page = DEFAULT_PAGE,
    pageSize = DEFAULT_PAGE_SIZE,
  } = queryParamsMapping(req.query);

  const allTodos = Boolean(userId) ? TODOS_PER_USER[userId!] : TODOS;
  const filteredTodos = filter(
    allTodos,
    removeNullableProperties({
      userId,
      id,
      completed,
      title,
    }),
  ) as Todo[];

  const { items, total, totalPages } = paginate(filteredTodos, page, pageSize);

  return res.json({
    data: {
      total,
      totalPages,
      page,
      pageSize,
      data: items,
      query: req.query,
    },
  });
};
