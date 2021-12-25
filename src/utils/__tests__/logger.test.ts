import logger, { Severity } from '../logger';

const consoleMocks = {
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
  error: jest.fn(),
};

global.console = {
  ...global.console,
  ...consoleMocks,
};

describe('utils/logger', () => {
  describe('with NODE_ENV="production"', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      process.env.NODE_ENV = 'test';
    });

    it.each`
      text       | severity
      ${'warn'}  | ${'warn'}
      ${'info'}  | ${'info'}
      ${'log'}   | ${'log'}
      ${'error'} | ${'error'}
    `(
      'should not call "console.$severity" with message "$text"',
      ({ text, severity }: { text: string; severity: Severity }) => {
        logger[severity](text);

        expect(consoleMocks[severity]).not.toBeCalled();
        expect(consoleMocks[severity]).not.toHaveBeenCalledWith(text);
      },
    );
  });

  describe('with NODE_ENV !== "production"', () => {
    it.each`
      text       | severity
      ${'warn'}  | ${'warn'}
      ${'info'}  | ${'info'}
      ${'log'}   | ${'log'}
      ${'error'} | ${'error'}
    `(
      'should call "console.$severity" with message "$text"',
      ({ text, severity }: { text: string; severity: Severity }) => {
        logger[severity](text);

        expect(consoleMocks[severity]).toBeCalled();
        expect(consoleMocks[severity]).toHaveBeenCalledWith(text);
      },
    );
  });
});
