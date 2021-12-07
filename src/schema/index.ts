import { makeExecutableSchema } from '@graphql-tools/schema';

import rootTypeDefs from './root.typeDefs.gql';
import * as todo from './todo';
import { Resolvers } from './types';

export const typeDefs = [
  // define typeDefs
  rootTypeDefs,
  todo.typeDefs,
];

export const resolvers: Resolvers[] = [
  // define resolvers
  todo.resolvers,
];

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default executableSchema;
