import { ApolloServer } from 'apollo-server';
import { ApolloServerExpressConfig } from 'apollo-server-express';

import dataSources from './datasources';
import schema from './schema';

const apolloConfig: ApolloServerExpressConfig = {
  schema,
  dataSources: () => dataSources,
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer(apolloConfig);

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
