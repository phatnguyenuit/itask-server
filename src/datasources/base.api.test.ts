import { RequestOptions } from 'apollo-datasource-rest';

import { ResolverContext } from 'schema/types';
import BaseAPI from './base.api';

const mockSet = jest.fn();

class TestBaseABI extends BaseAPI {
  context = {
    headers: {
      'x-access-token': 'token',
    },
  } as unknown as ResolverContext;

  public testWillSendRequest() {
    const request = {
      headers: { set: mockSet },
    } as unknown as RequestOptions;
    this.willSendRequest(request);
  }
}

describe('datasources/base', () => {
  const testBaseAPI = new TestBaseABI();

  it('should set x-access-token header', () => {
    testBaseAPI.testWillSendRequest();

    expect(mockSet).toBeCalledWith('x-access-token', 'token');
  });

  it('should set correlation_id header', () => {
    testBaseAPI.testWillSendRequest();

    expect(mockSet).toBeCalledWith('correlation_id', expect.any(String));
  });
});
