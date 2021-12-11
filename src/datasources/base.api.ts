import { RESTDataSource } from 'apollo-datasource-rest';
import { ResolverContext } from '../schema/types';
import { Validator } from '../typings/common';
import { validateRawData } from '../utils/common';

class BaseAPI extends RESTDataSource<ResolverContext> {
  // TODO handle http request
  // async httpRequest(method: any, ...options: any[]): Promise<any> {
  //   const headers = {
  //     'content-type': 'application/json',
  //   };

  //   const [url, paramsOrBody, errorOptions = {}] = options;
  //   const { errorHandler: customErrorHandler, skipErrorLink } = errorOptions;
  // }

  protected logOrThrowValidationError<TResponse>(
    validator: Validator<TResponse>,
    response: unknown,
  ): TResponse {
    try {
      return validateRawData(validator, response);
    } catch (error: any) {
      console.warn(this.context.headers, error.message);
      throw error;
    }
  }
}

export default BaseAPI;
