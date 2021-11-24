import { Resolvers } from '../index';

export const resolvers: Resolvers = {
  Query: {
    async getBooks(_, __, { dataSources }) {
      return await dataSources.BookAPI.getBooks();
    },
  },
};
