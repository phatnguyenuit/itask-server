import { CreateTodoPayload, SearchTodoParams, UpdateTodoPayload } from 'shared';
import { NonNullableDeep } from 'typings/common';
import {
  CreateTodoResponse,
  SearchTodosResponse,
  UpdateTodoResponse,
} from './jsonPlaceholder.api.types';
import { validate } from './jsonPlaceholder.api.types.validator';
import BaseAPI from '../base.api';

class JSONPlaceholderAPI extends BaseAPI {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com';
  }

  async searchTodos(
    userId: number,
    params: Partial<NonNullableDeep<SearchTodoParams>>,
  ) {
    const path = `/users/${userId}/todos`;
    const response = await this.get(path, params);

    return this.logOrThrowValidationError<SearchTodosResponse>(
      validate('SearchTodosResponse'),
      response,
    );
  }

  async createTodo(payload: CreateTodoPayload) {
    const path = `/todos`;
    const response = await this.post(path, payload);

    return this.logOrThrowValidationError<CreateTodoResponse>(
      validate('CreateTodoResponse'),
      response,
    );
  }

  async updateTodo(
    id: number,
    payload: Partial<NonNullableDeep<UpdateTodoPayload>>,
  ) {
    const path = `/todos/${id}`;
    const response = await this.patch(path, payload);

    return this.logOrThrowValidationError<UpdateTodoResponse>(
      validate('UpdateTodoResponse'),
      response,
    );
  }

  async deleteTodo(id: number) {
    try {
      const path = `/todos/${id}`;
      await this.delete(path);

      return true;
    } catch (error) {
      return false;
    }
  }
}

export default JSONPlaceholderAPI;
