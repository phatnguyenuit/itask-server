import { getEnv } from 'config/env';
import { SearchTodoParams } from 'shared';
import { NonNullableDeep } from 'typings/common';
import { SearchTodosResponse } from './todo.api.types';
import { validate } from './todo.api.types.validator';
import BaseAPI from '../base.api';

class TodoAPI extends BaseAPI {
  constructor() {
    super();
    this.baseURL = `${getEnv('ITASK_API_URL')}/api/v1/todos`;
  }

  async searchTodos(
    userId: number,
    params: Partial<NonNullableDeep<SearchTodoParams>>,
  ) {
    const response = this.logOrThrowValidationError<SearchTodosResponse>(
      validate('SearchTodosResponse'),
      await this.get('/', { ...params, userId }),
    );

    return response.data;
  }
}

export default TodoAPI;
