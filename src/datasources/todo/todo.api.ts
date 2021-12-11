import { getEnv } from 'config/env';
import { CreateTodoPayload, SearchTodoParams, UpdateTodoPayload } from 'shared';
import { NonNullableDeep } from '../../typings/common';

import BaseAPI from '../base.api';
import { validate } from './todo.api.types.validator';

class TodoAPI extends BaseAPI {
  constructor() {
    super();
    this.baseURL = `${getEnv('ITASK_API_URL')}/api/v1/todos`;
  }

  async searchTodos(
    userId: number,
    params: Partial<NonNullableDeep<SearchTodoParams>>,
  ) {
    const response = this.logOrThrowValidationError(
      validate('SearchTodosResponse'),
      await this.get('/', { ...params, userId }),
    );

    return response.data;
  }

  async createTodo(payload: CreateTodoPayload) {
    const response = this.logOrThrowValidationError(
      validate('CreateTodoResponse'),
      await this.post('/', payload),
    );

    return response;
  }

  async getTodo(id: number) {
    const response = this.logOrThrowValidationError(
      validate('GetTodoResponse'),
      await this.get(`/${id}`),
    );

    return response;
  }

  async updateTodo(id: number, payload: UpdateTodoPayload) {
    const response = this.logOrThrowValidationError(
      validate('UpdateTodoResponse'),
      await this.patch(`/${id}`, payload),
    );

    return response;
  }

  async deleteTodo(id: number) {
    await this.delete(`/${id}`);

    return true;
  }
}

export default TodoAPI;
