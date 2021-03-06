import {
  RequestOptions,
  RESTDataSource,
  Request,
  Response,
} from 'apollo-datasource-rest';
import { ValueOrPromise } from 'apollo-server-types';
import { v4 as uuid_v4 } from 'uuid';

import { ResolverContext } from '../schema/types';
import { Validator } from '../typings/common';
import { validateRawData } from '../utils/common';

abstract class BaseAPI extends RESTDataSource<ResolverContext> {
  // TODO handle http request
  // async httpRequest(method: any, ...options: any[]): Promise<any> {
  //   const headers = {
  //     'content-type': 'application/json',
  //   };

  //   const [url, paramsOrBody, errorOptions = {}] = options;
  //   const { errorHandler: customErrorHandler, skipErrorLink } = errorOptions;
  // }
  protected willSendRequest(request: RequestOptions): ValueOrPromise<void> {
    const token = this.context.headers['x-access-token'];
    request.headers.set('x-access-token', String(token));
    request.headers.set('correlation_id', uuid_v4());
  }

  deleteCacheForRequest(request: Request) {
    this.memoizedResults.delete(this.cacheKeyFor(request));
  }

  protected didReceiveResponse(response: Response, request: Request) {
    this.deleteCacheForRequest(request);
    return super.didReceiveResponse(response, request);
  }

  protected didEncounterError(error: Error, request: Request) {
    this.deleteCacheForRequest(request);
    return super.didEncounterError(error, request);
  }

  protected logOrThrowValidationError<TResponse>(
    validator: Validator<TResponse>,
    response: unknown,
  ): TResponse {
    try {
      return validateRawData(validator, response);
    } catch (error: any) {
      // console.warn(this.context.headers, error.message);
      throw error;
    }
  }
}

export default BaseAPI;
