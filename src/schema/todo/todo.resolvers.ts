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
    getTodo: (_, { id }, { dataSources }) => dataSources.TodoAPI.getTodo(id),
  },
  Mutation: {
    createTodo: (_, { payload }, { dataSources }) =>
      dataSources.TodoAPI.createTodo(payload),
    updateTodo: (_, { id, payload }, { dataSources }) => {
      const nonNullablePayload = removeNullableProperties(payload);

      return dataSources.TodoAPI.updateTodo(id, nonNullablePayload);
    },
    deleteTodo: (_, { id }, { dataSources }) =>
      dataSources.TodoAPI.deleteTodo(id),
  },
};
