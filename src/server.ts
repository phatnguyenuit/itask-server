import { ApolloServer, ApolloServerExpressConfig } from 'apollo-server-express';
import { Application } from 'express';

import app from './app';
import { loadEnv } from './config/env';
import { apolloConfig, httpServer } from './config/server';
import { getEnv } from './utils/common';

// Ensure environment variables are read.
loadEnv();

async function startApolloServer(
  config: ApolloServerExpressConfig,
  app: Application,
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
