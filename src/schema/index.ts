import { makeExecutableSchema } from '@graphql-tools/schema';
import { IncomingHttpHeaders } from 'http';

import { DataSources } from 'datasources';
import { Resolvers as GeneratedResolvers } from 'shared';

import rootTypeDefs from './root.typeDefs.gql';
import * as book from './book';
import * as todo from './todo';

export type ResolverContext = {
  dataSources: DataSources;
  headers: IncomingHttpHeaders;
};

export type Resolvers = GeneratedResolvers<ResolverContext>;

export const typeDefs = [
  // define typeDefs
  rootTypeDefs,
  book.typeDefs,
  todo.typeDefs,
];

export const resolvers: Resolvers[] = [
  // define resolvers
  book.resolvers,
  todo.resolvers,
];

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default executableSchema;
