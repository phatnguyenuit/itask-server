import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginDrainHttpServer,
  PluginDefinition,
} from 'apollo-server-core';
import express, { Request } from 'express';
import http from 'http';

import app from './app';
import { loadEnv, getEnv } from './config/env';
import dataSources from './datasources';
import schema from './schema';
// import prisma from './utils/prisma';

// Ensure environment variables are read.
loadEnv();

const httpServer = http.createServer(app);

const apolloPlugins = [
  ApolloServerPluginDrainHttpServer({ httpServer }),
  process.env.NODE_ENV === 'production'
    ? ApolloServerPluginLandingPageDisabled // Disable landing page for production mode
    : undefined,
].filter(Boolean) as PluginDefinition[];

let request: Request;

const apolloConfig: ApolloServerExpressConfig = {
  schema,
  dataSources: () => dataSources,
  plugins: apolloPlugins,
  nodeEnv: process.env.NODE_ENV,
  context: ({ req }) => {
    request = req;

    return {
      headers: req.headers,
      // prisma, // Prisma client context
    };
  },
  formatError: (error) => {
    if (!error.extensions.correlation_id) {
      error.extensions.correlation_id = request.headers['correlation_id'];
    }

    return error;
  },
};

async function startApolloServer(
  config: ApolloServerExpressConfig,
  app: express.Application,
) {
  const server = new ApolloServer(config);

  await server.start();
  server.applyMiddleware({ app });

  const PORT = Number(getEnv('PORT', '4000'));
  const ITASK_API_URL = getEnv('ITASK_API_URL');

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve),
  );

  console.log(`🚀 Server ready at ${ITASK_API_URL}${server.graphqlPath}`);
}

startApolloServer(apolloConfig, app);
