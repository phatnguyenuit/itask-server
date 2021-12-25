import { ApolloServerExpressConfig } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginDrainHttpServer,
  PluginDefinition,
} from 'apollo-server-core';
import http from 'http';

import app from '../app';
import dataSources from '../datasources';
import schema from '../schema';
// import prisma from './utils/prisma';

export const httpServer = http.createServer(app);

export const getApolloPlugins = () =>
  [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled // Disable landing page for production mode
      : undefined,
  ].filter(Boolean) as PluginDefinition[];

export const apolloConfig: ApolloServerExpressConfig = {
  schema,
  dataSources: () => dataSources,
  plugins: getApolloPlugins(),
  nodeEnv: process.env.NODE_ENV,
  context: ({ req }) => ({
    headers: req.headers,
    // prisma,  // Prisma client context
  }),
};
