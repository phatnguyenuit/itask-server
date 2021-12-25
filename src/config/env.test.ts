import path from 'path';
import { getEnvFiles } from './env';

describe('config/env', () => {
  describe('genEnvFiles', () => {
    it('should return list of env files correctly', () => {
      const envFiles = getEnvFiles();

      expect(envFiles).toEqual([
        path.resolve('.env.test.local'),
        path.resolve('.env.test'),
        path.resolve('.env'),
      ]);
    });

    describe.each`
      NODE_ENV
      ${'development'}
      ${'production'}
    `('with NODE_ENV="$NODE_ENV"', ({ NODE_ENV }) => {
      beforeEach(() => {
        process.env.NODE_ENV = NODE_ENV;
      });

      afterEach(() => {
        process.env.NODE_ENV = 'test';
      });

      it('should return list of env files correctly', () => {
        const envFiles = getEnvFiles();

        expect(envFiles).toEqual([
          path.resolve(`.env.${NODE_ENV}.local`),
          path.resolve('.env.local'),
          path.resolve(`.env.${NODE_ENV}`),
          path.resolve('.env'),
        ]);
      });
    });
  });
});
