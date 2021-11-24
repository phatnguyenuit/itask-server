import { Book } from 'shared';

export type BookResponse = {
  data: Book[];
  test: {
    path: string;
  };
};
