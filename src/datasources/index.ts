import TodoAPI from './todo/todo.api';

export type DataSources = {
  TodoAPI: TodoAPI;
};

const dataSources: DataSources = {
  TodoAPI: new TodoAPI(),
};

export default dataSources;
