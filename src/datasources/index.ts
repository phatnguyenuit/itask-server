import JSONPlaceholderAPI from './json-placeholder/jsonPlaceholder.api';
import TodoAPI from './todo/todo.api';

export type DataSources = {
  JSONPlaceholderAPI: JSONPlaceholderAPI;
  TodoAPI: TodoAPI;
};

const dataSources: DataSources = {
  JSONPlaceholderAPI: new JSONPlaceholderAPI(),
  TodoAPI: new TodoAPI(),
};

export default dataSources;
