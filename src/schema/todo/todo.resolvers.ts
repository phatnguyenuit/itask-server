import { removeNullableProperties } from 'utils/common';
import { Resolvers } from '../types';

export const resolvers: Resolvers = {
  Query: {
    searchTodos: async (_, { userId, searchParams }, { dataSources }) => {
      const {
        page,
        pageSize,
        totalPages,
        total,
        data: todos,
      } = await dataSources.TodoAPI.searchTodos(
        userId,
        removeNullableProperties(searchParams),
      );

      return {
        page,
        pageSize,
        totalPages,
        total,
        todos,
      };
    },
  },
  Mutation: {
    createTodo: (_, { payload }, { dataSources }) => {
      return dataSources.JSONPlaceholderAPI.createTodo(payload);
    },
    updateTodo: (_, { id, payload }, { dataSources }) => {
      const nonNullablePayload = removeNullableProperties(payload);

      return dataSources.JSONPlaceholderAPI.updateTodo(id, nonNullablePayload);
    },
    deleteTodo: (_, { id }, { dataSources }) =>
      dataSources.JSONPlaceholderAPI.deleteTodo(id),
  },
};
