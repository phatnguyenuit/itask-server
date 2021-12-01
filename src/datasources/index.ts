import JSONPlaceholderAPI from './json-placeholder/jsonPlaceholder.api';

export type DataSources = {
  JSONPlaceholderAPI: JSONPlaceholderAPI;
};

const dataSources: DataSources = {
  JSONPlaceholderAPI: new JSONPlaceholderAPI(),
};

export default dataSources;
