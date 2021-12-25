import { ResponseResolver, RestRequest, RestContext } from 'msw';

export const createSuccessResolver =
  <TData>(data: TData): ResponseResolver<RestRequest, RestContext, TData> =>
  (_, res, ctx) =>
    res(ctx.status(200), ctx.json(data));

export const createFailedResolver =
  (
    errorMessage: string,
    statusCode: number,
  ): ResponseResolver<RestRequest, RestContext, { message: string }> =>
  (_, res, ctx) =>
    res(ctx.status(statusCode), ctx.json({ message: errorMessage }));
