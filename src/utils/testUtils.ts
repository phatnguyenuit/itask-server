import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

type ParsedQs = Request['query'];

interface MockRequestParams<
  TBody,
  TQuery extends ParsedQs = ParsedQs,
  TParams = ParamsDictionary,
> {
  body?: TBody;
  query?: TQuery;
  params?: TParams;
}

export const createMockRequest = <
  TBody,
  TQuery extends ParsedQs = ParsedQs,
  TParams = ParamsDictionary,
>({
  body,
  query,
  params,
}: MockRequestParams<TBody, TQuery>) =>
  ({ body, query, params } as unknown as Request<TParams, TBody, TQuery>);
