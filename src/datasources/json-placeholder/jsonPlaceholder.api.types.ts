import { Todo } from 'shared';

export type SearchTodosResponse = Todo[];
export type SearchTodoParams = Partial<Omit<Todo, 'userId'>>;
