import BaseAPI from '../base.api';
import {
  SearchTodosResponse,
  SearchTodoParams,
} from './jsonPlaceholder.api.types';
import { validate } from './jsonPlaceholder.api.types.validator';

class TodoAPI extends BaseAPI {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com';
  }

  async searchTodos(userId: number, params?: SearchTodoParams) {
    const path = `/users/${userId}/todos`;
    const response = await this.get(path, params);

    return this.logOrThrowValidationError<SearchTodosResponse>(
      validate('SearchTodosResponse'),
      response,
    );
  }
}

export default TodoAPI;
