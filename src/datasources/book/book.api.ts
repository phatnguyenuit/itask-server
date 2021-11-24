import BaseAPI from '../base.api';
import { BookResponse } from './book.api.types';
import { validate } from './book.api.types.validator';

const books = [
  {
    author: 'Fast Nguyen',
    title: 'Hello World!',
  },
  {
    author: 'Fast Nguyen',
    title: 'Hello TypeScript!',
  },
  {
    author: 'John Nguyen',
    title: 'Critical thinking',
  },
];

class BookAPI extends BaseAPI {
  constructor() {
    super();
    this.baseURL = '# TBU';
  }

  async getBooks() {
    return this.logOrThrowValidationError<BookResponse>(
      validate('BookResponse'),
      books,
    );
  }
}

export default BookAPI;
