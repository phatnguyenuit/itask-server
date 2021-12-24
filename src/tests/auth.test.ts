import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { prismaMock } from 'setupTests';

import app from '../app';
import * as authUtils from '../utils/auth';
import * as encryption from '../utils/encryption';

const verifyMock = jest.spyOn(encryption, 'verify');
const generateTokenMock = jest.spyOn(authUtils, 'generateToken');
const jwtDecodeMock = jest.spyOn(jwt, 'decode');

const basePath = '/api/v1/auth';

describe(basePath, () => {
  const request = supertest(app);

  describe('/login', () => {
    it('should login successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'test',
        email: 'test@local.com',
        password: 'hashed-password',
      });
      verifyMock.mockResolvedValue(true);
      generateTokenMock.mockResolvedValue('jwt-token');
      jwtDecodeMock.mockReturnValue({
        payload: {
          exp: 1000,
        },
      });

      const response = await request.post(`${basePath}/login`).send({
        email: 'test@local.com',
        password: '123@password',
      });

      expect(response.body).toStrictEqual({
        data: { expiredAt: 1000, accessToken: 'jwt-token' },
      });
    });
  });
});
