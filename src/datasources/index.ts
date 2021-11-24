import BookAPI from './book/book.api';

export type DataSources = {
  BookAPI: BookAPI;
};

const dataSources: DataSources = {
  BookAPI: new BookAPI(),
};

export default dataSources;
