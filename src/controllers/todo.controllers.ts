import { RequestHandler, Request } from 'express';
import { loremIpsum } from 'lorem-ipsum';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'constants/common';
import { Todo } from 'shared';
import { paginate } from 'utils/paginate';

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

const createTodoPredicate =
  (params: Partial<Todo>) =>
  (todo: Todo): boolean => {
    const { id, userId, completed, title } = params;

    return [
      Boolean(id) ? todo.id === id : true,
      Boolean(userId) ? todo.userId === userId : true,
      completed !== undefined ? todo.completed === completed : true,
      Boolean(title) ? new RegExp(title!, 'i').test(todo.title) : true,
    ].every(Boolean);
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
  const filteredTodos: Todo[] = allTodos.filter(
    createTodoPredicate({
      userId,
      id,
      completed,
      title,
    }),
  );

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
