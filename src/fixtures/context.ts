import { ExpressContext } from 'apollo-server-express';
import { Request, Response } from 'express';

export const MOCK_EXPRESS_CONTEXT: ExpressContext = {
  req: {
    headers: {
      'x-access-token': 'token',
    },
  } as unknown as Request,
  res: {} as unknown as Response,
};
