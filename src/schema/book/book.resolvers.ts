import { Resolvers } from '../index';

export const resolvers: Resolvers = {
  Query: {
    books: () => [
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
    ],
  },
};
