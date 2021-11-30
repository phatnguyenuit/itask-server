import { mapToJSONPlaceholderSearchParams } from 'mappers/jsonPlaceholder.mapper';
import { Resolvers } from '../index';

export const resolvers: Resolvers = {
  Query: {
    async searchTodos(_, { userId, searchParams }, { dataSources }) {
      const mappedSearchParams = mapToJSONPlaceholderSearchParams(searchParams);
      return await dataSources.JSONPlaceholderAPI.searchTodos(
        userId,
        mappedSearchParams,
      );
    },
  },
};
