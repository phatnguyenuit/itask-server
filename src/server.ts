import { ApolloServer } from 'apollo-server';
import { ApolloServerExpressConfig } from 'apollo-server-express';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';

import dataSources from './datasources';
import schema from './schema';

const plugins =
  process.env.NODE_ENV === 'production'
    ? [ApolloServerPluginLandingPageDisabled] // Disable landing page for production mode
    : [];

const apolloConfig: ApolloServerExpressConfig = {
  schema,
  plugins,
  dataSources: () => dataSources,
  nodeEnv: process.env.NODE_ENV,
  context: ({ req }) => ({ headers: req.headers }),
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer(apolloConfig);

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
