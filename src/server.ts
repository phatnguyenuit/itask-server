import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginDrainHttpServer,
  PluginDefinition,
} from 'apollo-server-core';
import { AuthenticationError } from 'apollo-server-errors';
import express from 'express';
import http from 'http';

import dataSources from './datasources';
import schema from './schema';

const app = express();
const httpServer = http.createServer(app);

const apolloPlugins = [
  ApolloServerPluginDrainHttpServer({ httpServer }),
  process.env.NODE_ENV === 'production'
    ? ApolloServerPluginLandingPageDisabled // Disable landing page for production mode
    : undefined,
].filter(Boolean) as PluginDefinition[];

const apolloConfig: ApolloServerExpressConfig = {
  schema,
  plugins: apolloPlugins,
  dataSources: () => dataSources,
  nodeEnv: process.env.NODE_ENV,
  context: ({ req }) => {
    const token = req.headers.authorization || '';

    if (!token) throw new AuthenticationError('You must be logged in.');

    return { headers: req.headers };
  },
};

async function startApolloServer(
  config: ApolloServerExpressConfig,
  app: express.Application,
) {
  const server = new ApolloServer(config);

  await server.start();
  server.applyMiddleware({ app });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(apolloConfig, app);
