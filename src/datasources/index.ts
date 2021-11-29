import BookAPI from './book/book.api';
import JSONPlaceholderAPI from './json-placeholder/jsonPlaceholder.api';

export type DataSources = {
  BookAPI: BookAPI;
  JSONPlaceholderAPI: JSONPlaceholderAPI;
};

const dataSources: DataSources = {
  BookAPI: new BookAPI(),
  JSONPlaceholderAPI: new JSONPlaceholderAPI(),
};

export default dataSources;
