// import { PrismaClient } from '@prisma/client';
import { IncomingHttpHeaders } from 'http';

import { DataSources } from 'datasources';
import { Resolvers as GeneratedResolvers } from 'shared';

export type ResolverContext = {
  dataSources: DataSources;
  headers: IncomingHttpHeaders;
  //   prisma: PrismaClient; // Prisma client
};

export type Resolvers = GeneratedResolvers<ResolverContext>;
