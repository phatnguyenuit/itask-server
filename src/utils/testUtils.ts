import { Request } from 'express';

type ParsedQs = Request['query'];

interface MockRequestParams<TBody, TQuery extends ParsedQs = ParsedQs> {
  body?: TBody;
  query?: TQuery;
}

export const createMockRequest = <TBody, TQuery extends ParsedQs = ParsedQs>({
  body,
  query,
}: MockRequestParams<TBody, TQuery>) => ({ body, query } as unknown as Request);
