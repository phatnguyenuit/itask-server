import { removeNullableProperties } from 'utils/common';
import { Resolvers } from '../index';

export const resolvers: Resolvers = {
  Query: {
    searchTodos: (_, { userId, searchParams }, { dataSources }) => {
      const nonNullableParams = removeNullableProperties(searchParams);

      return dataSources.JSONPlaceholderAPI.searchTodos(
        userId,
        nonNullableParams,
      );
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
