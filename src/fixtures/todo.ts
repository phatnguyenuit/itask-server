import { Todo } from '@prisma/client';

export const MOCK_TODOS: Todo[] = [
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

export const MOCK_TODO = MOCK_TODOS[0];
