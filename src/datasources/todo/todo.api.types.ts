import { Todo } from 'shared';
import { PaginationData } from 'typings/common';

export type SearchTodosResponse = {
  data: PaginationData<Todo>;
};

export type CreateTodoResponse = Todo;
export type GetTodoResponse = Todo;
export type UpdateTodoResponse = Todo;
