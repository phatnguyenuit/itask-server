import { Todo } from 'shared';
import { PaginationData } from 'typings/common';

export type SearchTodosResponse = {
  data: PaginationData<Todo>;
};
