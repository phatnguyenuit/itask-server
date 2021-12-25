import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { getApolloPlugins } from './server';

describe('config/server', () => {
  describe('getApolloPlugins', () => {
    describe.each`
      NODE_ENV
      ${'test'}
      ${'development'}
    `('with NODE_ENV="$NODE_ENV"', ({ NODE_ENV }) => {
      beforeEach(() => {
        process.env.NODE_ENV = NODE_ENV;
      });

      afterEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('should exclude ApolloServerPluginLandingPageDisabled', () => {
        const plugins = getApolloPlugins();

        expect(plugins).not.toContain(ApolloServerPluginLandingPageDisabled);
      });
    });

    describe('with NODE_ENV="production"', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production';
      });

      afterEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('should include ApolloServerPluginLandingPageDisabled', () => {
        const plugins = getApolloPlugins();

        expect(plugins).toContain(ApolloServerPluginLandingPageDisabled);
      });
    });
  });
});
