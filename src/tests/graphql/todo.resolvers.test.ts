import { ApolloServer } from 'apollo-server-express';
import { gql } from 'graphql-tag';

import { apolloConfig } from 'config/server';
import { MOCK_EXPRESS_CONTEXT } from 'fixtures/context';
import { MOCK_TODO, MOCK_TODOS } from 'fixtures/todo';
import {
  createCreateTodoSuccessHandler,
  createGetTodoSuccessHandler,
  createSearchTodosSuccessHandler,
  createUpdateTodoSuccessHandler,
  deleteTodoSuccessHandler,
} from 'mocks/handlers/todo.handlers';
import { mockServer } from 'mocks/server';

describe('resolvers/todo', () => {
  let apolloServer: ApolloServer;

  beforeAll(() => {
    apolloServer = new ApolloServer(apolloConfig);
  });

  describe('searchTodos', () => {
    const SEARCH_TODOS = gql`
      query searchTodos($userId: Int!, $searchParams: SearchTodoParams) {
        searchTodos(userId: $userId, searchParams: $searchParams) {
          page
          pageSize
          total
          totalPages
          todos {
            id
            userId
            title
            isCompleted
          }
        }
      }
    `;

    it('should search todos successfully', async () => {
      mockServer.use(
        createSearchTodosSuccessHandler({
          total: MOCK_TODOS.length,
          totalPages: 1,
          page: 1,
          pageSize: 10,
          data: MOCK_TODOS,
        }),
      );
      // run query against the server and snapshot the output
      const res = await apolloServer.executeOperation(
        {
          query: SEARCH_TODOS,
          variables: { userId: 1 },
        },
        MOCK_EXPRESS_CONTEXT,
      );

      expect(res).toMatchSnapshot();
    });
  });

  describe('getTodo', () => {
    const GET_TODO = gql`
      query getTodo($getTodoId: Int!) {
        getTodo(id: $getTodoId) {
          id
          userId
          title
          isCompleted
        }
      }
    `;

    it('should get todo by id successfully', async () => {
      mockServer.use(createGetTodoSuccessHandler(MOCK_TODO));
      // run query against the server and snapshot the output
      const res = await apolloServer.executeOperation(
        {
          query: GET_TODO,
          variables: { getTodoId: 1 },
        },
        MOCK_EXPRESS_CONTEXT,
      );

      expect(res).toMatchSnapshot();
    });
  });

  describe('createTodo', () => {
    const CREATE_TODO = gql`
      mutation createTodo($payload: CreateTodoPayload!) {
        createTodo(payload: $payload) {
          id
          userId
          title
          isCompleted
        }
      }
    `;

    it('should create todo successfully', async () => {
      mockServer.use(createCreateTodoSuccessHandler(MOCK_TODO));
      // run query against the server and snapshot the output
      const res = await apolloServer.executeOperation(
        {
          query: CREATE_TODO,
          variables: {
            payload: {
              userId: 1,
              title: 'todo 1',
              isCompleted: false,
            },
          },
        },
        MOCK_EXPRESS_CONTEXT,
      );

      expect(res).toMatchSnapshot();
    });
  });

  describe('updateTodo', () => {
    const UPDATE_TODO = gql`
      mutation updateTodo($updateTodoId: Int!, $payload: UpdateTodoPayload!) {
        updateTodo(id: $updateTodoId, payload: $payload) {
          id
          userId
          title
          isCompleted
        }
      }
    `;

    it('should update todo successfully', async () => {
      mockServer.use(createUpdateTodoSuccessHandler(MOCK_TODO));
      // run query against the server and snapshot the output
      const res = await apolloServer.executeOperation(
        {
          query: UPDATE_TODO,
          variables: {
            updateTodoId: 1,
            payload: {
              title: 'todo 1',
            },
          },
        },
        MOCK_EXPRESS_CONTEXT,
      );

      expect(res).toMatchSnapshot();
    });
  });

  describe('deleteTodo', () => {
    const DELETE_TODO = gql`
      mutation deleteTodo($deleteTodoId: Int!) {
        deleteTodo(id: $deleteTodoId)
      }
    `;

    it('should delete todo successfully', async () => {
      mockServer.use(deleteTodoSuccessHandler);
      // run query against the server and snapshot the output
      const res = await apolloServer.executeOperation(
        {
          query: DELETE_TODO,
          variables: {
            deleteTodoId: 1,
          },
        },
        MOCK_EXPRESS_CONTEXT,
      );

      expect(res).toMatchSnapshot();
    });
  });
});
