import { makeExecutableSchema } from '@graphql-tools/schema';
import { IncomingHttpHeaders } from 'http';

import { DataSources } from 'datasources';
import { Resolvers as GeneratedResolvers } from 'generated/graphql.types';

import rootTypeDefs from './root.typeDefs.gql';
import * as book from './book';

export type ResolverContext = {
  dataSources: DataSources;
  headers: IncomingHttpHeaders;
};

export type Resolvers = GeneratedResolvers<ResolverContext>;

export const typeDefs = [
  // bookType
  rootTypeDefs,
  book.typeDefs,
];

export const resolvers: Resolvers[] = [
  // define resolvers
  book.resolvers,
];

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default executableSchema;
