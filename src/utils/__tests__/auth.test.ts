import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { generateToken, verifyToken } from '../auth';

const responseCallbackMock = jest.fn();

jest.spyOn(jwt, 'sign').mockImplementation((...args: any[]) => {
  const [callback] = args.slice(-1);

  callback(...responseCallbackMock());
});

jest.spyOn(jwt, 'verify').mockImplementation((...args: any[]) => {
  const [callback] = args.slice(-1);

  callback(...responseCallbackMock());
});

describe('utils/auth', () => {
  describe('generateToken', () => {
    const data = { payload: 1 };

    it('should generate token', async () => {
      responseCallbackMock.mockReturnValue([null, 'jwt token here.']);
      const token = await generateToken(data);

      expect(token).toBe('jwt token here.');
    });

    it('should raise error from jwt', () => {
      const error = new Error('Fail to generate.');
      responseCallbackMock.mockReturnValue([error]);

      generateToken(data).catch((e) => {
        expect(e).toBe(error);
      });
    });

    it.each`
      token
      ${undefined}
      ${''}
    `('should raise error when not get token from jwt', ({ token }) => {
      responseCallbackMock.mockReturnValue([null, token]);

      generateToken(data).catch((e) => {
        expect(e.message).toBe('Could not generate jwt token.');
      });
    });
  });

  describe('verifyToken', () => {
    const token = 'token here.';
    const actualData = { payload: 1 };

    it('should verify token', async () => {
      responseCallbackMock.mockReturnValue([null, actualData]);
      const data = await verifyToken(token);

      expect(data).toBe(actualData);
    });

    it('should raise expired error', async () => {
      responseCallbackMock.mockReturnValue([
        new TokenExpiredError('expired', new Date()),
      ]);

      verifyToken(token).catch((e) => {
        expect(e.message).toBe('Expired access token.');
      });
    });

    it('should raise invalid token error', async () => {
      responseCallbackMock.mockReturnValue([new Error('Other error.')]);

      verifyToken(token).catch((e) => {
        expect(e.message).toBe('Invalid access token.');
      });
    });
  });
});
